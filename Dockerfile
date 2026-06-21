# ── Etapa 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# ── Etapa 2: Imagem final enxuta ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copia dependências e código-fonte já preparados
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json

# Usuário sem privilégios de root (segurança)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "src/server.js"]
