# Build
FROM        node:11.4.0-alpine as builder

COPY        package.json /base/
WORKDIR     /base/

RUN         yarn install --production
COPY        .babelrc /base/
#COPY        .eslintrc /base/
COPY        api/app.js /base/server/
COPY        api/routes.js /base/server/
COPY        api /base/server/api/
COPY        api/config /base/server/config/
RUN         yarn run build

# Deploy
FROM        node:11.4.0-alpine

LABEL       "maintainer"="Achilleas Michos <achilleas.michos@gmail.com"
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
WORKDIR     /base/web.api/
COPY        --from=builder /base/build /base/web.api/build
COPY        --from=builder /base/node_modules /base/web.api/node_modules
COPY        --from=builder /base/package.json /base/web.api/package.json

EXPOSE      8080
CMD         ["tini", "--", "npm", "start"]
