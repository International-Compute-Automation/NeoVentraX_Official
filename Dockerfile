# Stage 1: install dependencies (clean, reproducible)
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: build the site (Astro server + assets) into /app/dist
FROM node:24-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV ASTRO_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3: minimal artifact - just dist/: the self-contained Astro server (dist/server/entry.mjs, all
# dependencies bundled, no node_modules) and the browser assets (dist/client)
FROM scratch AS artifact
WORKDIR /
COPY --from=builder /app/dist ./dist
CMD ["/artifact-placeholder"]
