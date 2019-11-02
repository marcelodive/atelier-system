#!/bin/bash

echo 'Initiating sync'

rsync -au \
  --exclude '.git' \
  --exclude '.gitignore' \
  --exclude 'datasources.json' \
  --exclude 'deploy' \
  --exclude 'config.json' \
  ~/Developer/luiza-sales/ ~/Developer/7140-665b97281eaf860448cb6787d283d643/

echo 'Ended sync'
