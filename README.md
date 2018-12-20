# Node.js API project

This is an effort to create a sample project for a Restful API written in Node.js using best practices. An overview of the technologies used follows.

**Stack:** Node.js with express written in typescript, with MongoDB.

**Code quality:** Strict linter configuration, enforced during development and production build. API is split in discrete modules that contain all relevant code and tests.

**Documentation:** Swagger API documentation, automatically configurable for deployment environment and split per module.  

**Deployment:** Docker with environment variable configured in runtime (no storage of secrets in code).

## Stack



## Code quality



## Documenation

**splitting the config file**

https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-8-splitting-specification-file/



## Deployment

docker build -t web.api .

**Default configuration**

docker run -d --name web-api -p 8080:8080 -it web.api

