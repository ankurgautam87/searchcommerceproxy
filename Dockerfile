# Use an official Node.js runtime as a parent image.
# Using a specific version like '18-slim' is good for reproducibility and smaller image size.
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
# The wildcard `package*.json` copies both if `package-lock.json` exists.
COPY package*.json ./

# Install application dependencies
# Using --only=production ensures that only production dependencies are installed,
# which can reduce the image size and build time.
RUN npm install --only=production

# Bundle app source inside the Docker image
COPY . .

# Your app binds to port 3001, so expose it
EXPOSE 3001

# Define the command to run your app using CMD which defines the runtime
CMD [ "npm", "start" ]
