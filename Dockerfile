FROM bitnami/express

WORKDIR /usr/src/app

COPY ["package.json", "./"]

RUN npm install && mv node_modules ../

COPY . .

EXPOSE 3000

RUN npm install -g nodemon

CMD npm start