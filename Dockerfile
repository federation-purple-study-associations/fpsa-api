FROM node:12

WORKDIR /backend

COPY package.json .
COPY package-lock.json .
COPY .env .

RUN npm i --production

ADD ./dist ./dist
COPY package.json ./dist

CMD node dist/main.js
EXPOSE 3000/tcp
