FROM node:22 AS build

WORKDIR /backend

COPY package*.json .
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

FROM node:22 AS output

WORKDIR /backend

COPY --from=build /backend/node_modules ./node_modules
COPY --from=build /backend/package*.json .
COPY --from=build /backend/dist ./dist
COPY --from=build /backend/.env .

CMD ["npm", "run", "start:prod"]
