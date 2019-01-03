# Build
FROM        node:11.6.0-alpine as builder

COPY        package.json /web.api/
COPY        tsconfig.json /web.api/
COPY        tslint.json /web.api/
COPY        typings.d.ts /web.api/
COPY        api/ /web.api/api/
WORKDIR     /web.api/

RUN         yarn install --production
RUN         yarn run build

# Deploy
FROM        node:11.6.0-alpine

LABEL       "maintainer"="Achilleas Michos <achilleas.michos@gmail.com>"
LABEL       "description"="This is the Docker container that will provide all web API services for the app"

ENV         HTTP_MODE http
ENV         NODE_ENV="production"
ARG         NODE_PROCESSES=2
ENV         NODE_PROCESSES=$NODE_PROCESSES

# Install Tini
RUN         apk upgrade --update --no-cache && \
                apk add --update --no-cache curl util-linux tini

# Install pm2
RUN         npm install -g pm2@3.2.3


# Copy over code
WORKDIR     /web.api/
COPY        --from=builder /web.api/dist /web.api/dist
COPY        --from=builder /web.api/node_modules /web.api/node_modules
COPY        --from=builder /web.api/package.json /web.api/package.json

EXPOSE      8080
CMD         ["tini", "--", "npm", "start"]
