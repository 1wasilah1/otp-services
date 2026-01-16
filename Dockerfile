FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/auth_info_baileys

EXPOSE 3000

CMD ["npx", "tsx", "src/index.ts"]
