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
sleep 4
echo "start"

#npm login --registry=http://localhost:55551 --scope=@tutu
npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55551
cd /Users/dim/Desktop/github/tutu/js-npm-migrate
npm publish
cd -
npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55552

echo "check: http://localhost:55551"
read check1
jest --testNamePattern=migrate
#npm test

echo "check: http://localhost:55552"
read check2

#todo make assert
echo "test complete success"

clear
