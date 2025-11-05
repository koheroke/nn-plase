FROM node:22
WORKDIR /app 
COPY . .
RUN npm install 
RUN npx prisma generate
WORKDIR /app/client
RUN npm install && npm run build
RUN npm 
CMD npx prisma db push && npx prisma generate && npm start
