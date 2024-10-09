
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


ENV MONGO_URI="mongodb+srv://db:data1477jt@crud.tljwy.mongodb.net/test"
ENV JWT_SECRET="jwt_secret_key"
ENV PORT=5000
ENV ACCESS_KEY=jwtsecret
ENV REFRESH_KEY=jwtsecretkey
ENV S3_REGION=ru-1
ENV S3_ENDPOINT=https://s3.timeweb.cloud
ENV S3_ACCESS_KEY=9EG3VUWN61ZKSH0QWFWQ
ENV S3_SECRET_KEY=DhlNKCZis1xMbKVYBH6cX2Wtu4KXfS7WfH0ZBHgA
ENV S3_BUCKET_NAME=729e17de-andasoft-buckets

EXPOSE 5000

CMD ["npm", "run", "start"]