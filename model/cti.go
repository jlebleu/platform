package model

type CallDetail struct {
    Duration         string     `json:"duration"`
    DstUsername      string     `json:"dstUsername"`
    SrcUsername      string     `json:"srcUsername"`
    Status           string     `json:"status"`
}