FROM node:lts

WORKDIR /backend

COPY package.json .
COPY package-lock.json .

RUN npm i --production

COPY ./dist ./dist
COPY package.json ./dist

CMD node dist/main.js
EXPOSE 3000/tcp
