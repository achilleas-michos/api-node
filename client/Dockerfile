# Build
FROM        node:11.4.0-alpine as builder

LABEL       cache.store.intermediate="datagrid.client"

WORKDIR     /srv/webapp/client
ADD         package.json /srv/webapp/client/
RUN         yarn install --production
ADD         . /srv/webapp/client/
RUN         yarn run build:production && cp Caddyfile dist/


# Deploy
FROM        alpine:latest

LABEL       "maintainer"="Achilleas Michos <achilleas.michos@gmail.com>"
LABEL       "description"="This is the Docker container that will provide the web interface app"

RUN         apk add --no-cache curl && \
              curl -s "https://caddyserver.com/download/linux/amd64?plugins=http.cache,http.prometheus&license=personal" | tar -C /tmp/ -xzv && \
              mv /tmp/caddy /usr/local/bin/caddy && rm -Rf /tmp/*
WORKDIR     /srv/webapp/client
COPY        --from=builder /srv/webapp/client/dist/ .

EXPOSE      80
CMD         ["caddy"]
