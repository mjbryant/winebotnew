#!/bin/bash

for FILENAME in $(ls data/wines/)
do
    node scripts/2023-03-16-migrate-wine-schema.js data/wines/$FILENAME
    mv data/wines/${FILENAME}.new data/wines/$FILENAME
done
