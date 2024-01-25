# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

RUN ls -la /usr/src/app  # Before build
# Build the app
RUN npm run build || cat /usr/src/app/npm-debug.log
RUN ls -la /usr/src/app/dist  # After build

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Run npm start when the container launches
CMD ["npm", "run", "serve"]
