FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build


FROM node:16-alpine AS final

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG VERIFICATION_SERVICE_URL
ENV VERIFICATION_SERVICE_URL=$VERIFICATION_SERVICE_URL

COPY --from=builder ./app/dist ./dist

COPY package.json .

COPY yarn.lock .

COPY ./prisma .

RUN yarn install --production

CMD [ "yarn", "start" ]