FROM node:18
WORKDIR /app

# Install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Bind-mount your source
VOLUME ["/app"]

# Expose port your dev server uses
EXPOSE 5001

# Default command: start dev server (e.g. nodemon)
CMD ["npm", "run", "dev"]