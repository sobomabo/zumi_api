FROM node:16

# App working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY . .
# .env provision
COPY staging.env .env


EXPOSE 3001

CMD [ "npm", "server.js" ]