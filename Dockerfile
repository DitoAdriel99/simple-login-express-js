# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install nodemon db-migrate db-migrate-mysql -g

RUN npm install

# Copy all source files to the working directory
COPY . .

# Change startup script permission to be excutable
RUN chmod +x startup.sh

# Command to start the application
CMD ["sh", "-c", "/home/node/app/startup.sh"]