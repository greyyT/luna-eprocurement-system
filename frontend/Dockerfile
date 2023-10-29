FROM node:lts-alpine as build

WORKDIR /usr/src/frontend

COPY . .

RUN npm ci && \
    npm run build

ENV CI=true \
    PORT=3000

FROM nginx:stable-alpine as main

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./* 

COPY --from=build /usr/src/frontend/dist .

CMD ["nginx", "-g", "daemon off;"]