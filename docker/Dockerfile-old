FROM node:lts-alpine3.14

# Define some ENV Vars
ENV PORT=80 \
  DIRECTORY=/app \
  IS_DOCKER=true

# Create and set the working directory
WORKDIR ${DIRECTORY}

# Copy over both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./
COPY yarn.lock ./

# Install project dependencies
RUN yarn

# Copy over all project files and folders to the working directory
COPY . .

# Build initial app for production
RUN yarn build

# Expose given port
EXPOSE ${PORT}

# Finally, run start command to serve up the built application
CMD [ "yarn", "build-and-start"]

# Run simple healthchecks every 5 mins, to check the Dashy's everythings great
HEALTHCHECK --interval=5m --timeout=2s --start-period=30s CMD yarn health-check
