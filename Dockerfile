FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=${PORT:-3000}

CMD ["npm", "start"]

EXPOSE $PORT
