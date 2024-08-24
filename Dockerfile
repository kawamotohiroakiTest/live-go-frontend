FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "PORT=${PORT:-3000} npm start"]
