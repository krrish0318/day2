# Multi-stage Dockerfile for SmartVenue AI

# Stage 1: Build Client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Server
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Production Environment
FROM node:18-alpine
WORKDIR /app

# Copy server assets
COPY --from=server-build /app/server/package*.json ./
COPY --from=server-build /app/server/dist ./dist
RUN npm install --production

# Copy client build to serve as static files from Express (optional, assuming we serve both from Cloud Run container vs separate services)
# Actually, for Cloud Run single container we usually serve static frontend via Express.
COPY --from=client-build /app/client/dist ./public

# Set Node environment to production
ENV NODE_ENV=production
# Application port
EXPOSE 8080
ENV PORT=8080

CMD ["npm", "start"]
