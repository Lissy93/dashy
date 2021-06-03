# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# production stage
FROM alpine:3.11

ENV USER darkhttpd
ENV GROUP darkhttpd
ENV GID 911
ENV UID 911
ENV PORT 8080

RUN addgroup -S ${GROUP} -g ${GID} && adduser -D -S -u ${UID} ${USER} ${GROUP} && \
  apk add -U --no-cache su-exec darkhttpd

COPY --from=build-stage --chown=${USER}:${GROUP} /app/dist /www/
COPY --from=build-stage --chown=${USER}:${GROUP} /app/dist/assets /www/default-assets
COPY entrypoint.sh /entrypoint.sh

EXPOSE ${PORT}
VOLUME /www/assets
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]