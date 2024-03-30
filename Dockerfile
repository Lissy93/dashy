FROM node:18.19.1-alpine AS BUILD_IMAGE

# Set the platform to build image for
ARG TARGETPLATFORM
ENV TARGETPLATFORM=${TARGETPLATFORM:-linux/amd64}

# Install additional tools needed if on arm64 / armv7
RUN \
  case "${TARGETPLATFORM}" in \
  'linux/arm64') apk add --no-cache python3 make g++ ;; \
  'linux/arm/v7') apk add --no-cache python3 make g++ ;; \
  esac

# Create and set the working directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --ignore-engines --immutable --no-cache --network-timeout 300000 --network-concurrency 1

# Copy over all project files and folders to the working directory
COPY . ./

# Build initial app for production
RUN yarn build --mode production

# Production stage
FROM node:20.11.1-alpine3.19

# Define some ENV Vars
ENV PORT=80 \
  DIRECTORY=/app \
  IS_DOCKER=true

# Create and set the working directory
WORKDIR ${DIRECTORY}

# Update tzdata for setting timezone
RUN apk add --no-cache tzdata

# Copy built application from build phase
COPY --from=BUILD_IMAGE /app ./
# Ensure only one version of conf.yml exists
RUN rm dist/conf.yml

# Finally, run start command to serve up the built application
CMD [ "yarn", "build-and-start" ]

# Expose the port
EXPOSE ${PORT}

# Run simple healthchecks every 5 mins, to check that everythings still great
HEALTHCHECK --interval=5m --timeout=5s --start-period=30s CMD yarn health-check
