
# Taking lots of container size >1GB
# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000
# CMD ["npm", "run", "dev"]


# Builder
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .

# Production

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install --omit=dev

EXPOSE 5000

CMD ["npm", "run", "dev"]


