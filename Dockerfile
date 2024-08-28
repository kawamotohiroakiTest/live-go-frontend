FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN if [ "$ENV_MODE" = "production" ]; then npm run build; fi

CMD ["sh", "-c", "if [ \"$ENV_MODE\" = \"production\" ]; then npm start; else npm run dev; fi"]
