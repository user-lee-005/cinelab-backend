# Use an official Node.js image as the base image
FROM node:19.3.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that the application runs on
EXPOSE 3001

# Start the application
CMD ["npx", "nodemon", "app"]
