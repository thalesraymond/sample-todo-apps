package models

import "time"

type Todo struct {
	Id        string    `json:"id"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	UserId    string    `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
