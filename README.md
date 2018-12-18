# Node.js API project

## Swagger

**Json file references**
https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-8-splitting-specification-file/

## Deployment
docker build -t web.api .

**Default configuration**

docker run -d --name web-api -p 8080:8080 -it web.api

