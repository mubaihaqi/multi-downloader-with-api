# Base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set workdir
WORKDIR /app

# Copy files
COPY package* ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy all files
COPY . .

RUN pnpm build

# Expose Vite port
EXPOSE 4321

# Start Vite preview server
CMD ["pnpm", "preview", "--port", "4321", "--host", "0.0.0.0"]