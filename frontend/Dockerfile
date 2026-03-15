# -----------------------------
# Stage 1 — Install dependencies
# -----------------------------
FROM node:20-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./

RUN npm ci


# -----------------------------
# Stage 2 — Build Next.js app
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js production bundle
RUN npm run build


# -----------------------------
# Stage 3 — Production image
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

# Create secure non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only production artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Give permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
CMD node -e "require('http').get('http://localhost:3000', (res) => { if(res.statusCode !== 200) process.exit(1) })"

CMD ["npm", "start"]