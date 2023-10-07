# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install nodemon node-db-migrate -g

RUN npm install

# Copy all source files to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 6666

# Command to start the application
CMD ["nodemon", "index.js"]