FROM node:14

ENV NODE_ENV=development

WORKDIR /usr/src/frontend

COPY package*.json ./
RUN npm install 

COPY . .

RUN npm run build
RUN npm install -g serve

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "serve -s dist"]