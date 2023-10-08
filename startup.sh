#!/usr/bin/env sh

./wait-for-it.sh database:3306 --timeout=50
npm run migrate-up
npm run start