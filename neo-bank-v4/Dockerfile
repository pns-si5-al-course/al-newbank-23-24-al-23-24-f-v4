# BUILDER
FROM node:18-alpine as builder
ENV NODE_ENV production
WORKDIR /app
COPY package.json yarn.lock ./
COPY --chown=node:node . .
RUN yarn install && yarn build
RUN mv .env.docker .env
USER node

# PRODUCTION
FROM alpine as production
RUN apk add nodejs
COPY --chown=node:node --from=builder /app/dist /app/dist
COPY --chown=node:node --from=builder /app/node_modules /app/node_modules
COPY --chown=node:node --from=builder /app/.env /app/.env
WORKDIR /app

CMD ["node", "dist/src/main.js"]
EXPOSE 3005
