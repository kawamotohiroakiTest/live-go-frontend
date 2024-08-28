FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ビルドは本番環境でのみ実行
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# 環境変数によって異なるコマンドを実行
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi"]
