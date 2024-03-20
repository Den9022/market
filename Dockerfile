FROM node:alpine
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ARG ENV_VARIABLE_NAME
CMD ["sh", "-c", "npm run start:$ENV_VARIABLE_NAME"]
