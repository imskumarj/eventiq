# -----------------------------
# Stage 1 — Dependencies
# -----------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Install system deps required by Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies (clean + reproducible)
RUN npm ci

# -----------------------------
# Stage 2 — Build Prisma Client
# -----------------------------
FROM node:20-alpine AS build

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# -----------------------------
# Stage 3 — Production Image
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install minimal system dependencies
RUN apk add --no-cache openssl

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

# Copy only necessary files
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

# Set ownership
RUN chown -R nodeuser:nodejs /app

USER nodeuser

# Expose backend port
EXPOSE 5000

# Healthcheck (important for production)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { if(res.statusCode!==200) process.exit(1) })"

# Start server
CMD ["node", "src/server.js"]