FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/auth_info_baileys

EXPOSE 3000

CMD ["npx", "tsx", "src/index.ts"]
