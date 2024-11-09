# FROM node:16

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["node", "server.js"]

FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (this ensures bcrypt is installed correctly for the container's architecture)
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your backend runs on
EXPOSE 5000

# Run your app
CMD ["npm", "start"]

