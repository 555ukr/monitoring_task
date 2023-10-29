FROM bitnami/express

WORKDIR /usr/src/app

COPY ["nodejs-app/package.json", "nodejs-app/index.js", "./"]

RUN npm install && mv node_modules ../

EXPOSE 3000

RUN npm install -g nodemon

CMD npm start