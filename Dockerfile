# --- Base Stage ---
FROM node:22-alpine AS base
WORKDIR /app

# --- Dependencies Stage ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# --- Development Stage ---
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Builder Stage ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_BACKEND_SERVER_ADDRESS
ENV NEXT_PUBLIC_BACKEND_SERVER_ADDRESS=${NEXT_PUBLIC_BACKEND_SERVER_ADDRESS}

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create nextjs system user/group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets and built standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
