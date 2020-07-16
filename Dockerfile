FROM node:latest

RUN mkdir -p srv/app

WORKDIR /srv/app

COPY ./ /srv/app/

RUN npm install
