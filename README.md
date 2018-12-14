# API Deployment
docker build -t datagrid.api .

**Default configuration**
docker run -d --name datagrid-api -p 8080:8080 -it datagrid.api

