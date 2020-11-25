#!/bin/bash

echo "start sleep_publish.sh"
sleep 3
echo "after sleep sleep_publish.sh"

(node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r $VERDACCIO_PROTOCOL://0.0.0.0:$VERDACCIO_PORT) && (npm publish)
echo "end sleep_publish.sh"

