FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-scripts

COPY . .

RUN yarn build


EXPOSE 3500

CMD [ "yarn", "start:prod" ]