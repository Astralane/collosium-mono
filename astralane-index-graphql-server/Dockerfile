# Stage 1: Install dependencies
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

# Stage 2: Build the application
FROM node:18 AS build-app

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Run the application
FROM node:18

WORKDIR /usr/src/app

COPY --from=build-app /usr/src/app/node_modules ./node_modules
COPY --from=build-app /usr/src/app/dist ./dist
COPY package.json ./

CMD ["npm", "run", "start:prod"]
