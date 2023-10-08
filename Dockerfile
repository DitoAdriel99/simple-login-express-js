# Use the official Node.js image as the base image
FROM node:14-alpine

# Add bash shell for run wait-for-it.sh script
RUN apk add --no-cache bash

# Set the working directory in the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install nodemon db-migrate db-migrate-mysql -g

RUN npm install

# Copy all source files to the working directory
COPY . .

# Make it excutable
RUN chmod +x startup.sh
RUN chmod +x wait-for-it.sh

# Command to start the application
CMD ["sh", "-c", "/home/node/app/startup.sh"]