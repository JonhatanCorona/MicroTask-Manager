# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Compilar TypeScript
RUN npm run build

# Etapa 2: producción
FROM node:20-alpine
WORKDIR /usr/src/app

# Copiar solo los build y node_modules de producción
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --production

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]
