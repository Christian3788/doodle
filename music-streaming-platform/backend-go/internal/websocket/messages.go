package websocket

type MessageType string

const (
	MsgPlay        MessageType = "PLAY"
	MsgPause       MessageType = "PAUSE"
	MsgSeek        MessageType = "SEEK"
	MsgTrackChange MessageType = "TRACK_CHANGE"
	MsgJoinRoom    MessageType = "JOIN_ROOM"
	MsgSyncState   MessageType = "SYNC_STATE"
)

type EventMessage struct {
	Type     MessageType `json:"type"`
	RoomID   string      `json:"roomId"`
	UserID   string      `json:"userId"`
	TrackID  string      `json:"trackId,omitempty"`
	Position float64     `json:"position"` // seconds
	SentAt   int64       `json:"sentAt"`   // Unix timestamp in ms
}