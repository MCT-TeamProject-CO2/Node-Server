FROM node:15-buster

EXPOSE 8080

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

ENTRYPOINT [ "node", "--experimental-loader=./util/loader.js", "." ]