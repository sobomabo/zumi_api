FROM node:16

# App working directory
WORKDIR /user/app

# copy the json file first
COPY package.json ./

# install npm dependencies
RUN npm install

# Bundle app source
COPY . .

# connect to external port 3001
EXPOSE 3001

CMD [ "npm", "run", "dev" ]