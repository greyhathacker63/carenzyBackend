FROM node:18-alpine as build
RUN apk add --no-cache tzdata
ENV TZ=Asia/Kolkata
WORKDIR /usr/app
COPY . /usr/app
RUN npm install
RUN npm install pm2 -g

EXPOSE 5509

# CMD ["pm2-runtime","start","./src/app.js","-i","0"]
CMD ["pm2-runtime","start","./src/app.js"]
