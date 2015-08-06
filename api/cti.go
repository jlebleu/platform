package api

import (
    l4g "code.google.com/p/log4go"
    "fmt"
    "github.com/gorilla/mux"
    "github.com/mattermost/platform/model"
    "net/http"
    "github.com/mattermost/platform/utils"
    "bytes"
)

func InitCti(r *mux.Router) {
    l4g.Debug("Initializing channel cti routes")

    sr := r.PathPrefix("/cti").Subrouter()
    sr.Handle("/dial", ApiUserRequired(dial)).Methods("POST")
}

func dial(c *Context, w http.ResponseWriter, r *http.Request) {
    data := model.MapFromJson(r.Body)
    srcUserName := data["src_user_name"]
    dstUserName := data["dst_user_name"]

    result := make(map[string]string)
    result["username"] = dstUserName
    json := model.MapToJson(result)
    jsonB := []byte(json)
    url := fmt.Sprintf("http://%s:%d/xuc/api/1.0/dialByUsername/mattermost/%s/", utils.Cfg.XucSettings.XucHost, utils.Cfg.XucSettings.XucPort, srcUserName)

    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonB))

    if err != nil {
        l4g.Error("Error when dialing", err)
    }

    defer resp.Body.Close()
}