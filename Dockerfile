FROM node:11

RUN apt update
#RUN apt install -y nano git mc

RUN mkdir -p srv

WORKDIR /srv

COPY package.json ./

RUN npm install

EXPOSE 8080