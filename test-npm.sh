#!/bin/bash

function clear {
  echo "clear"
  docker kill $(docker ps -q)
  docker rm $(docker ps -a -q)
}

#docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio

#docker run --name verdaccio -p 4873:4873 verdaccio/verdaccio
#docker run --name verdaccio -p 4874:4873 verdaccio/verdaccio

clear

docker-compose --file npm-registries.yml up -d
sleep 2
#echo "start"

#node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55551
node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55552

#cd test-package-dir
#npm ci
#npm publish
#cd -

node_modules/.bin/jest --testNamePattern=npm-api && echo "upload test success" # && clear

#clear #todo clear if fails
