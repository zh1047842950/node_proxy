FROM registry.cn-hangzhou.aliyuncs.com/dev_image_list/node_env:v4
RUN mkdir /workspace/node_proxy -p
WORKDIR /workspace/node_proxy
COPY / .
RUN source /etc/profile \
&& ls \
&& pm2 --version
EXPOSE 9080
