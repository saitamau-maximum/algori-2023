FROM node:20.10.0-slim
WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8081

ENTRYPOINT [ "node", "dist/main.js"]

CMD [ "http://localhost:8080/", "Dealer 1", "Player 1" ]
