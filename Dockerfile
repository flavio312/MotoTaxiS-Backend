FROM node:22-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml .npmrc ./

RUN npm install -g pnpm

ENV CI=true

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]