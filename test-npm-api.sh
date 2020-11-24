#!/bin/bash

function clear {
  echo "clear"
  docker kill $(docker ps -q)
  docker rm $(docker ps -a -q)
}

clear

docker-compose --file npm-registries.yml up -d
sleep 2
#echo "start"

node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55552

node_modules/.bin/jest --testNamePattern=npm-api && echo "upload test success" # && clear

#clear #todo clear if fails
