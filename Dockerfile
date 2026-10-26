# Construction par Dockerfile : évite le constructeur Railpack de Railway (pannes « frontend grpc server closed »)
FROM node:18.20.8-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["npm", "run", "start"]
