#!/bin/bash

echo 'Initiating sync'

rsync -au --exclude '.git' --exclude 'datasources.json' --exclude 'deploy' ~/Developer/luiza-sales/ ~/Developer/7140-665b97281eaf860448cb6787d283d643/

echo 'Ended sync'
