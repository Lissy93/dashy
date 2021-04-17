
# Build Stage
FROM node:lts-alpine as build-stage
LABEL Maintainer Alicia Sykes <alicia@omg.lol>

RUN apk update

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Production Stage
FROM nginx:1.15.7-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
