FROM node:20

# Set the working directory in the container
WORKDIR /src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./src ./src

# Copy the .env file to the working directory
COPY .env ./

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "src/server.js"]