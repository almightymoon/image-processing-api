FROM node:18

# Install Chromium and necessary dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set the PUPPETEER_EXECUTABLE_PATH to point to the Chromium executable
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]

