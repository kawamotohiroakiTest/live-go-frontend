FROM node:18-alpine

# 必要なパッケージをインストール
RUN apk add --no-cache tzdata

# タイムゾーンをAsia/Tokyoに設定
RUN cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo "Asia/Tokyo" > /etc/timezone

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
