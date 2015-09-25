# Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
# See License.txt for license information.
FROM ubuntu:14.04

# Install Dependancies
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y ruby-full
RUN gem install compass

# Postfix
RUN apt-get install -y postfix

#
# Install GO
#

RUN apt-get update && apt-get install -y \
		gcc libc6-dev make git mercurial \
		--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

ENV GOLANG_VERSION 1.4.2

RUN curl -sSL https://golang.org/dl/go$GOLANG_VERSION.src.tar.gz \
		| tar -v -C /usr/src -xz

RUN cd /usr/src/go/src && ./make.bash --no-clean 2>&1

ENV PATH /usr/src/go/bin:$PATH

RUN mkdir -p /go/src /go/bin && chmod -R 777 /go
ENV GOPATH /go
ENV PATH /go/bin:$PATH
WORKDIR /go

# Copy over files
ADD . /go/src/github.com/mattermost/platform

# Insert postfix config
ADD ./docker/ctidev/main.cf /etc/postfix/

RUN go get github.com/tools/godep
RUN cd /go/src/github.com/mattermost/platform;godep go install 
RUN cd /go/src/github.com/mattermost/platform/web/react; npm install
RUN mkdir /go/src/github.com/mattermost/platform/bin
RUN cp /go/bin/platform /go/src/github.com/mattermost/platform/bin/

ADD ./docker/ctidev/main.cf /etc/postfix/

ADD ./docker/ctidev/mattermost-entry.sh /

RUN chmod +x /mattermost-entry.sh
ENTRYPOINT /mattermost-entry.sh

# Create default storage directory
RUN mkdir /mattermost/

# Ports
EXPOSE 80
