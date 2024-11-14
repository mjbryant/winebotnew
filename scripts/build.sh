#!/bin/bash

# To run on server host
set -x
nvm use 16
npm i
npm run build
