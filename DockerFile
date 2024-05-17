FROM node:lts-slim as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

FROM node:lts-slim as runner

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules ./
COPY --from=builder /app/src ./src

EXPOSE 9000

CMD ["npm", "start"]

