#!/bin/bash

if [ -z "${KEYFILE}" ]; then
    echo "KEYFILE must be defined"
    exit 1
fi

if [ -z "${USER_HOST}" ]; then
    echo "USER_HOST must be defined"
    exit 1
fi

set -x

ssh -i $KEYFILE ${USER_HOST} -- rm -rf /home/ec2-user/winebot
rsync -avr -e "ssh -i ${KEYFILE}" --exclude 'node_modules' --exclude '__tests__' --exclude '.next' --exclude 'data/tastings' . ${USER_HOST}:/home/ec2-user/
