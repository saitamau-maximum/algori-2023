FROM node:20.10.0-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8081

ENTRYPOINT [ "node", "dist/main.js"]

CMD [ "http://localhost:8080/", "Dealer 1", "Player 1" ]
