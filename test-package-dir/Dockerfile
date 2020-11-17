FROM verdaccio/verdaccio:4.8.1

USER root
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY ./ /usr/src/app

#RUN (/opt/verdaccio/bin/verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://0.0.0.0:$VERDACCIO_PORT &) && \
#  (node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r $VERDACCIO_PROTOCOL://0.0.0.0:$VERDACCIO_PORT) && (npm publish)

#WORKDIR /opt/verdaccio
RUN pwd
RUN ls -la
CMD (sh /usr/src/app/sleep_publish.sh &) && /opt/verdaccio/bin/verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://0.0.0.0:$VERDACCIO_PORT

#docker build -t temp/npm_test_package:tag1 .
