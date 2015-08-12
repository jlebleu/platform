package api

import (
    l4g "code.google.com/p/log4go"
    "fmt"
    "github.com/gorilla/mux"
    "github.com/mattermost/platform/model"
    "net/http"
    "github.com/mattermost/platform/utils"
    "bytes"
    "encoding/json"
    "io"
)

func InitCti(r *mux.Router) {
    l4g.Debug("Initializing channel cti routes")

    sr := r.PathPrefix("/cti").Subrouter()
    sr.Handle("/dialByUsername", ApiUserRequired(dialByUsername)).Methods("POST")
    sr.Handle("/dial", ApiUserRequired(dial)).Methods("POST")
}

func dial(c *Context, w http.ResponseWriter, r *http.Request) {
    data := model.MapFromJson(r.Body)
    userName := data["user_name"]
    number := data["number"]

    result := make(map[string]string)
    result["number"] = number
    json := model.MapToJson(result)
    jsonB := []byte(json)
    url := fmt.Sprintf("http://%s:%d/xuc/api/1.0/dial/mattermost/%s/", utils.Cfg.XucSettings.XucHost, utils.Cfg.XucSettings.XucPort, userName)

    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonB))

    if err != nil {
        l4g.Error("Error when dialing", err)
    }

    defer resp.Body.Close()
}

func dialByUsername(c *Context, w http.ResponseWriter, r *http.Request) {
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

func getLastCall(userName string) *model.CallDetail {
    url := fmt.Sprintf("http://%s:%d/xuc/api/1.0/historyByUsername/mattermost/%s?size=1",
        utils.Cfg.XucSettings.XucHost, utils.Cfg.XucSettings.XucPort, userName)
    resp, err := http.Get(url)

    var detail *model.CallDetail
    if err != nil {
        l4g.Error("Error when getting history", err)
    } else {
        detail = CallDetailFromJson(resp.Body)
    }
    resp.Body.Close()
    return detail
}

func CallDetailFromJson(data io.Reader) *model.CallDetail {
    decoder := json.NewDecoder(data)
    var callDetails []model.CallDetail
    err := decoder.Decode(&callDetails)
    if err == nil && len(callDetails) > 0 {
        return &callDetails[0]
    } else {
        return nil
    }
}