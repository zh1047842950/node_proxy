#!/bin/bash
source /etc/profile &&
ls &&
pm2 --version &&
npm install &&
pm2 start npm --watch --name node_proxy -- run start
