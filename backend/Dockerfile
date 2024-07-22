FROM node:22-alpine

RUN mkdir -p /backend && chown -R node:node /backend

WORKDIR /backend

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

# Expose both HTTP and HTTPS ports
EXPOSE 3000 3443

CMD [ "npm", "start" ]
