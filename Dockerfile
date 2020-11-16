FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55552
RUN node_modules/.bin/jest --testNamePattern=migrate && echo "jest migrate test success" && clear
