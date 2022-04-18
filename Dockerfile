FROM node:lts-slim

RUN apt-get update; apt-get -y install curl

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=optional

COPY . .
RUN npm run bootstrap

WORKDIR /app/packages/server

EXPOSE 8080
EXPOSE 8089
CMD exec npm start