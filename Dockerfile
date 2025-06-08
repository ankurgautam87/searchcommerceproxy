# Use an official Node.js runtime as a parent image.
# Using a specific version like '18-slim' is good for reproducibility and smaller image size.
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install --only=production

COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]
