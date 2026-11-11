FROM node:20-alpine AS development
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3080
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3080"]
