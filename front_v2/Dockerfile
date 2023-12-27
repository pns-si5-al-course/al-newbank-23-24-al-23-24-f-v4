FROM alpine
RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev"]

