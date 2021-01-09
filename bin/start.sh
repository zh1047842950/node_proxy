#!bin/bash
  now=`date '+%Y-%m-%d %H:%M:%S'`
  echo "Hello node_proxy !"
  if [ -z "$TAILLOG" ]; then
    export TAILLOG=/var/log/*.log
  fi
  source /etc/profile
  pm2 -V
  npm install
  node ./src/index.js
  #pm2 start --name node_proxy npm -- start
  echo "Update node_proxy success!"$now
  # 日志监听，保持容器持续运行不退出
  tail -f $TAILLOG
