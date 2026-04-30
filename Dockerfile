# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.19-alpine

# ---------- builder stage ----------
FROM node:${NODE_VERSION} AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# NODE_ENV'i builder stage'de set ETME: vite build, prisma generate ve
# theme app extension build dev dependencies'e ihtiyaç duyar. NODE_ENV
# sadece runtime stage'de production olarak set edilir.

COPY package.json package-lock.json* ./
# --legacy-peer-deps: @easterngraphics/wcf'in peer deps'leri (jszip,
# @babylonjs/core, core-js) package-lock.json'a auto-include edilmediği
# için Alpine npm'in katı peer kontrolü patlıyor. Legacy modda bu kontrol
# kapalı; node_modules yine doğru kurulur.
RUN npm ci --legacy-peer-deps --no-audit --no-fund

COPY . .

# 1) Theme app extension bundle (configurator-app.js) build edilir.
# 2) React Router server build edilir.
RUN npx prisma generate \
 && npm run build

# Yalnızca prod bağımlılıklarını bırakacak şekilde temizle.
RUN npm prune --omit=dev --legacy-peer-deps \
 && npm cache clean --force

# ---------- runtime stage ----------
FROM node:${NODE_VERSION} AS runtime

RUN apk add --no-cache openssl tini

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# tini = init süreci; SIGTERM'de Node graceful shutdown.
ENTRYPOINT ["/sbin/tini", "--"]

# Builder'dan sadece çalışmak için gereken dosyaları kopyala.
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/app ./app
COPY --from=builder /app/public ./public
COPY --from=builder /app/extensions ./extensions
COPY --from=builder /app/scripts ./scripts

# Persistent volume mount noktası. fly.toml'da [[mounts]] altında
# `/app/.cache`'e bağlanır. SQLite DB (prod.sqlite), GLTF cache ve icon
# cache hep bu dizin altında tutulur.
VOLUME ["/app/.cache"]

EXPOSE 3000

# Container açılışında: cache alt dizinleri hazırla, prisma migrate'i
# uygula, sonra react-router-serve'ü başlat. `npm run docker-start`
# zaten `npm run setup && npm run start` zincirini çalıştırıyor.
CMD ["sh", "-c", "mkdir -p /app/.cache/db /app/.cache/gltf /app/.cache/icons && npm run docker-start"]
