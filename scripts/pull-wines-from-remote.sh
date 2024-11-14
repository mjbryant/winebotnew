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

scp -i ${KEYFILE} -r ${USER_HOST}:/home/ec2-user/data/wines/ ./data/
