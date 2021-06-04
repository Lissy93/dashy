FROM node:lts-alpine

# Define some ENV Vars
ENV PORT 80
ENV DIRECTORY /app
ENV IS_DOCKER true

# Create and set the working directory
WORKDIR ${DIRECTORY}

# Copy over both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

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