# Development Image 
FROM node:21-alpine3.18 AS development

WORKDIR /usr/app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]

# Development Image 
FROM node:21-alpine3.18 AS production

WORKDIR /usr/app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:21-alpine3.18

WORKDIR /usr/app

COPY --from=production /usr/app/.next ./.next
COPY --from=production /usr/app/node_modules ./node_modules
COPY --from=production /usr/app/package.json ./package.json

EXPOSE 3000

CMD ["yarn", "start"]