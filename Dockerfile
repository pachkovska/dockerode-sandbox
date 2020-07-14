FROM node:11

RUN mkdir -p srv/app

WORKDIR /srv/app

COPY ./ /srv/app/

RUN npm install
