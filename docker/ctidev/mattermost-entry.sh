#!/bin/bash
# Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
# See License.txt for license information.

mkdir -p web/static/js

# ------------------------

echo starting postfix
/etc/init.d/postfix restart

echo starting platform
cd  /go/src/github.com/mattermost/platform/bin
./platform -config=/config/config.json
