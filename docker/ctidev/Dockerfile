# Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
# See License.txt for license information.
FROM ubuntu:14.04

# Copy over files
WORKDIR /mattermost

ADD ./dist/mattermost.tar.gz /

# Insert postfix config

ADD ./docker/ctidev/main.cf /etc/postfix/

ADD ./docker/ctidev/mattermost-entry.sh /

RUN chmod +x /mattermost-entry.sh
ENTRYPOINT /mattermost-entry.sh

# Create default storage directory
RUN mkdir /mattermost/data

# Ports
EXPOSE 80
