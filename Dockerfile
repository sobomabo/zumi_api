FROM node:16

# App working directory
WORKDIR /user/app

# Install app dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY . .

# connect to external port 3001
EXPOSE 3001

CMD [ "npm", "server.js" ]