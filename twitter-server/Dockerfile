# ── Build stage ────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install OpenSSL for Prisma engine compatibility
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN yarn build

# ── Production stage ──────────────────────────────────────────
FROM node:20-alpine AS runner

# Install OpenSSL for Prisma engine at runtime
RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

EXPOSE 8000

CMD ["node", "build/index"]
