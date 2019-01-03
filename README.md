# Node.js API project

This is an effort to create a sample project for a Restful API written in Node.js using best practices. An overview of the technologies used follows.

**Stack:** Node.js with the express frame work (http://expressjs.com/) written in typescript (https://www.typescriptlang.org/).

**Code quality:** Strict linter configuration (https://github.com/palantir/tslint), enforced during development and production build. API is split in discrete modules that contain all relevant code and tests.

**Documentation:** Swagger API documentation (https://swagger.io/), that is configured using environment variables and is split per module.  

**Deployment:** Docker containers (https://www.docker.com/) with application configuration connected to environment variables that take values in runtime (no hard-coding of configuration in the application's code).

## Stack

Using the latest Node.js runtime (v. 11.6.0 at the time of writing) with express (v. 4.16.4). The code is written in typescript (v. 3.2.2).

![](https://github.com/achilleas-michos/api-node/blob/master/docs/folder-structure.png)

The configuration in "tsconfig" is as seen below. We are compiling to ES3 for backwards compatibility. 

```json
{
  "compilerOptions": {
    "target": "ES3",
    "module": "commonjs",
    "lib": ["es2018", "dom"],
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./api",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": [
    "api/**/*.ts",
    "api/**/*.json"
  ],
  "exclude": [
    "api/**/*spec.ts"
  ]
}
```

## Code quality

In order to enforce code quality we are using the tslint package with the following configuration (tslint.json), which sets the severity to "error". It also excludes .json files because the swagger config is not in line with the linter setup.

```json
{
  "defaultSeverity": "error",
  "extends": [
    "tslint:recommended"
  ],
  "jsRules": {},
  "rules": {
    "trailing-comma": [ false ]
  },
  "rulesDirectory": [],
  "linterOptions": {
    "exclude": [
      "./api/**/*.json"
    ]
  }
}
```

In order to enforce running the linter we have created the following scripts in package.json. The "lint" script runs the linter with the --fix option. If there are issues that can't be automatically fixed the script will fail.

Running the "lint" is enforced in both "build", when running a productive build and "dev" for development time.

```json
"main": "app.js",
"scripts": {
  "clean": "rm -rf dist",
  "lint": "tslint -c tslint.json -p tsconfig.json --fix",
  "tsc": "tsc -p .",
  "test": "mocha -r ts-node/register --recursive \"./api/**/*.spec.ts\"",
  "build": "npm-run-all clean lint tsc",
  "start": "pm2 start ./dist/app.js -i ${NODE_PROCESSES} --name 'web.api' --no-daemon",
  "dev:mon": "nodemon --watch api -e ts,json --exec ts-node ./api/app.ts",
  "dev": "npm-run-all lint dev:mon"
},
```

## Documentation (Swagger)

We are using "swagger-ui-express" middleware to serve the Swagger API interface, which is set up in the ./api/routes.ts. 

```typescript
import express from "express";
import fs from "fs";
import path from "path";
import swaggerUI from "swagger-ui-express";
import { config } from "./config/configuration";
import { interpolateSwaggerToJson, mergeSwaggerJson } from "./config/swagger";
import { logger } from "./config/wiston-logger";

const setupRoutes = (app: express.Application) => {
  /* Other routes go here */
    
  let swaggerFile = fs.readFileSync(path.join(config.root, "swagger.json"), "utf-8");

  swaggerFile = interpolateSwaggerToJson(swaggerFile, config);
  mergeSwaggerJson(JSON.stringify(swaggerFile)).then( (contents: any) => {
      app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(contents));
  }).catch((error) => {
      logger.error(`Loading swagger configuration: ${error}`);
  });
};

export { setupRoutes };
```

### Entry-point 

The main entry-point for the swagger configuration is the ./api/swagger.json, but it does contain the definitions of all end-points and models of our API, because we want to keep a modular architecture. 

Instead, it only handles high level configuration, such as host address and api base path and delegates the paths and definitions to two json files in the ./api/modules folder. 

```json
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Simple API",
    "description": "A simple API to learn how to write OpenAPI Specification"
  },
  "schemes":["http"],
  "host": "${HOST_NAME}:${PORT}",
  "basePath": "${API_BASE}",
  "paths": {"$ref": "./api/modules/swagger-paths.json"},
  "definitions": { "$ref": "./api/modules/swagger-definitions.json"}
}
```

![](https://github.com/achilleas-michos/api-node/blob/master/docs/modules-folder.png)

### High level paths

In its turn the swagger-paths.json contains the definitions of the high level end-points and the references to the modules that implement them.

```json
{
  "/user/{id}": { "$ref": "./users/endpoints-id.json"},
  "/user": { "$ref": "./users/endpoints.json"}
}
```

Same for the swagger-definitions.json

```json
{
  "User": { "$ref": "./users/schema.json"}
}
```

### Module specific paths

Finally each module defines the details of its entry-points and schemas in its own files.

- endpoints.json, for all endpoints directly at /api/[moduleName]
- endpoints-id.json, for all endpoints that act on a single item at /api/[moduleName]/[id]
- schema.json, the definitions for the data accepted or returned by the endpoints.

### Putting it togehter

In order to feed the whole configuration to the express swagger middleware we need to put it together.

First we load the main configuration file

```typescript
let swaggerFile = fs.readFileSync(path.join(config.root, "swagger.json"), "utf-8");
```

Variables like "host" and "basePath" in the main file are not hardcoded, instead they are controlled by environment variables (injected in the Docker image).  

These variables need to be interpolated at runtime, as below

```typescript
swaggerFile = interpolateSwaggerToJson(swaggerFile, config);
```

Finally all the references need to be resolved before setting up the /api-docs endpoint to server the swagger UI.

```typescript
import { mergeSwaggerJson } from "./config/swagger";

/* Other code here */
mergeSwaggerJson(JSON.stringify(swaggerFile)).then((contents: any) => {
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(contents));
}).catch((error) => {
    logger.error(`Loading swagger configuration: ${error}`);
});
```

**For more details on splitting the swagger config file see:**

https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-8-splitting-specification-file/

## Validate endpoint parameters	

An important part of API security is the ability to validate the parameters send to the endpoints, to make sure that there is no malicious content. The best approach is instead of filtering out what we think maybe malicious (black-listing) is to only allow the parameters that match what we expect (white-listing).

That would mean, describing all the data structures accepted by the end-points, which is of course a lot of work up-front and maintenance. But what about using the work already done to document the endpoints with swagger?

We can tell the endpoint to validate it's arguments based on that and use the swagger schemas both as **documentation** and as **validation** mechanisms. This is done by adding a custom request handler, "validateSchema()" to each endpoint that accepts arguments.

```typescript
import express from "express";
import {addSchema, validateSchema} from "../../common/parameter-validator";
import * as userSchema from "./schema.json";
import { addOne, count, deleteOne, edit, get } from "./users.controller";
const usersRouter = express.Router();

addSchema(userSchema, "user");

usersRouter.get("/user/", get);
usersRouter.get("/user/:id", get);
usersRouter.get("/user/count", count);
usersRouter.put("/user/",  validateSchema("user"), addOne);
usersRouter.delete("/user/:id", deleteOne);
usersRouter.post("/user/:id",  validateSchema("user"), edit);

export { usersRouter };
```

The handler, which uses Ajv node module, exposes a function addSchema() to register the schemas of our module. 

As you noticed this mechanism is also module central so we can add and remove modules in our application without affecting the others.

**Important**

In order to be able to import json files as modules in typescript we need to declare a typings.d.ts file with the following content

```typescript
declare module "*.json"{
    const value: any;
    export default value;
}
```

Additionally we need to include json files during the transpile process of typescript (by default only ts files are included). This means, adding the following configuration in the tsconfig.json

```json
"include": [
  "api/**/*.ts",
  "api/**/*.json"
],
```

## Deployment

The application is package as a docker image according to best practices for production deployment.

**Alpine Linux** base image which is only 45MBs in size and has no known vulnerabilities (according to vulnerabilities of quay.io)

```dockerfile
FROM        node:11.4.0-alpine
```

**Multi-stage build** to minimize the size of the deployed code. The Node.js code and modules are build in a pre-stage images and only the required files are copied to the final image 

```dockerfile
# Build
FROM        node:11.4.0-alpine as builder

WORKDIR     /web.api/
COPY        package.json /web.api/
COPY        tsconfig.json /web.api/
COPY        tslint.json /web.api/
COPY        api /web.api/api/

RUN         yarn install --production
RUN         yarn run build

# Deploy
FROM        node:11.4.0-alpine

....

WORKDIR     /web.api/
COPY        --from=builder /web.api/dist /web.api/dist
COPY        --from=builder /web.api/node_modules /web.api/node_modules
COPY        --from=builder /web.api/package.json /web.api/package.json
```

**PM2 execution** with configurable number of processes

package.json

```bash
"start": "pm2 start ./dist/app.js -i ${NODE_PROCESSES} --name 'web.api' --no-daemon"
```

 **Tini** instead of init to run the PM2 process. See tini github​ https://github.com/krallin/tini for more details. 

Use **Environment variables** to configure application that can be injected when running the container. That allows to use the same image for all deployment environments (dev, testing, prod, client on-premise) as no environment specific variable is defined in the code or in the docker image.

### Building and deploying

**Build image** 

```bash
docker build -t web.api .
```

**Run with default configuration**

When running the docker without any parameters, the application code makes sure that the default variables will be used, i.e. those of the local development.

```bash
docker run -d --name web-api -p 8080:8080 -it web.api
```

**Run with parameters**

```bash
docker run -d --name web-api \
	-e API_BASE=[e.g. /api] \
	-e HOST_NAME=[localhost|IP|URL] \
	-e port=[Port number] \
	-e secrets=[a secrete key] \
	-p [Port number]:[Port number] -it web.api
```

The environment variables read and injected in the express framework in the /api/config/configuration.ts file.
