FROM node:16.13.2-alpine AS BUILD_IMAGE

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
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Copy over all project files and folders to the working directory
COPY . ./

# Build initial app for production
RUN yarn build

# Production stage
FROM node:16.13.2-alpine

# Define some ENV Vars
ENV PORT=80 \
  DIRECTORY=/app \
  IS_DOCKER=true

# Create and set the working directory
WORKDIR ${DIRECTORY}

# Install tini for initialization and tzdata for setting timezone
RUN apk add --no-cache tzdata tini

# Copy built application from build phase
COPY --from=BUILD_IMAGE /app ./
# Ensure only one version of conf.yml exists
RUN rm dist/conf.yml

# Finally, run start command to serve up the built application
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "yarn", "build-and-start" ]

# Expose the port
EXPOSE ${PORT}

# Run simple healthchecks every 5 mins, to check that everythings still great
HEALTHCHECK --interval=5m --timeout=2s --start-period=30s CMD yarn health-check