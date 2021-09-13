FROM node:14

#ARM64 aws cli, will not work on intel based cpus(x86)
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install

RUN apt-get update && apt-get install -y python3-pip sqlite3 libsqlite3-dev
