# Node.js API project

## Swagger

** splitting the config file **

https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-8-splitting-specification-file/

## Deployment
docker build -t datagrid.api .

**Default configuration**

docker run -d --name datagrid-api -p 8080:8080 -it datagrid.api

