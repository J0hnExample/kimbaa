FROM node:22-alpine

RUN mkdir -p /frontend && chown -R node:node /frontend

WORKDIR /frontend

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000 3443

CMD [ "npm", "start" ]
