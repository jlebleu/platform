git co ctidev1.2.1 docker/ctidev

apply patches

* api/user.go
* model/message.go
* web/react/components/sidebar.jsx
* web/react/dispatcher/event_helpers.jsx
* web/react/stores/socket_store.jsx
* web/react/stores/user_store.jsx
* web/react/utils/constants.jsx
* web/react/utils/utils.jsx

make dist
docker build -t xivoxc/mattermost:cti1.3.0 -f docker/ctidev/Dockerfile .


test

    curl -XPOST -d '{"username":"acortial","status":8}' -H "Content-Type: application/json"  http://localhost:8665/api/v1/users/avencall/update_phone_status
    curl -XPOST -d '{"username":"acortial","status":0}' -H "Content-Type: application/json"  http://localhost:8665/api/v1/users/avencall/update_phone_status
