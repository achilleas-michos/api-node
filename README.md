# Node.js API project

This is an effort to create a sample project for a Restful API written in Node.js using best practices. An overview of the technologies used follows.

**Stack:** Node.js with the express frame work (http://expressjs.com/) written in typescript (https://www.typescriptlang.org/).

**Code quality:** Strict linter configuration (https://github.com/palantir/tslint), enforced during development and production build. API is split in discrete modules that contain all relevant code and tests.

**Documentation:** Swagger API documentation (https://swagger.io/), that is configured using environment variables and is split per module.  

**Deployment:** Docker containers (https://www.docker.com/) with application configuration connected to environment variables that take values in runtime (no hard-coding of configuration in the application's code).

## Stack



## Code quality



## Documentation (Swagger)

**splitting the config file**

https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-8-splitting-specification-file/



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

**Build image:** docker build -t web.api .

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