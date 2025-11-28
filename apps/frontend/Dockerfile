# Build stage
FROM oven/bun:1 AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build argument for WebSocket URL
ARG VITE_WS_URL
ENV VITE_WS_URL=$VITE_WS_URL

# Build the app
RUN bun run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
