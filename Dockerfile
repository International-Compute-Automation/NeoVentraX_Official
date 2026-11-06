# Stage 1: install dependencies (clean, reproducible)
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: build the static site into /app/dist
FROM node:24-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Form endpoint is baked in at build time (Astro PUBLIC_ variable)
ARG PUBLIC_FORM_ENDPOINT=""
ENV PUBLIC_FORM_ENDPOINT=$PUBLIC_FORM_ENDPOINT
ENV ASTRO_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3: minimal artifact - just the server and the built files, no node_modules
FROM scratch AS artifact
WORKDIR /
COPY --from=builder /app/server.cjs ./server.cjs
COPY --from=builder /app/dist ./dist
CMD ["/artifact-placeholder"]
