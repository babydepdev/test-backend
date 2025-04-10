FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm add @prisma/client

COPY . .

RUN pnpm add ts-node-dev --save-dev

RUN pnpm prisma generate

RUN pnpm tsc

EXPOSE 3000

CMD ["pnpm", "dev"]