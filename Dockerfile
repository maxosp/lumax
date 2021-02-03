FROM node:12.18.1-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN yarn i
ENV NODE_ENV=production

COPY . ./
RUN yarn build

FROM node:12.18.1-alpine
ENV NODE_ENV=production
ENV HOST=0.0.0.0

WORKDIR /app
COPY package*.json ./
RUN yarn i
# IMPORTANT! Razzle public dir path inlined in bundles as ABSOLUTE PATH!
COPY --from=builder /app/build /app/build

CMD yarn start

