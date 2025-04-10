FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm prisma generate

RUN pnpm run build

RUN ls -l /usr/src/app/build

CMD ["pnpm", "start"]