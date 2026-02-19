# ---------- Builder ----------
FROM node:20 AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV HUSKY=0

# Build-time args (frontend-visible)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ASSISTANT_ID
ARG LANGGRAPH_API_URL

# Expose to Next.js build (baked at build time)
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ASSISTANT_ID=${NEXT_PUBLIC_ASSISTANT_ID}
ENV LANGGRAPH_API_URL=${LANGGRAPH_API_URL}

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


# ---------- Runner ----------
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Runtime-only secrets (injected by Kubernetes)
ENV LANGSMITH_API_KEY=""
ENV DEFINE_EDGE_API_KEY=""
ENV DEFINE_EDGE_FUNDAMENTAL_APIS_BASE_URL=""

# Install Chromium + required libs for PDF
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
