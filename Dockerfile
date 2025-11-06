FROM node:22
WORKDIR /app 
COPY . .
RUN npm install 
RUN npx prisma generate
WORKDIR /app/client
RUN npm install
RUN npm run build
WORKDIR /app
CMD npx prisma db push && npx prisma generate && npm start
