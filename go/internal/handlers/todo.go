package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/todo-app/go/internal/middleware"
	"github.com/todo-app/go/internal/models"
	"github.com/todo-app/go/internal/repositories"
)

type TodoHandler struct {
	todoRepo repositories.TodoRepository
}

func NewTodoHandler(todoRepo repositories.TodoRepository) *TodoHandler {
	return &TodoHandler{
		todoRepo: todoRepo,
	}
}

type TodoRequest struct {
	Title string `json:"title"`
}

type UpdateTodoRequest struct {
	Title     *string `json:"title"`
	Completed *bool   `json:"completed"`
}

func (h *TodoHandler) List(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserIdKey).(string)
	if !ok {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	todos, err := h.todoRepo.GetTodosByUserId(userId)
	if err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(todos)
}

func (h *TodoHandler) Create(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserIdKey).(string)
	if !ok {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1048576)
	var req TodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		if err.Error() == "http: request body too large" {
			http.Error(w, `{"message": "Request body too large"}`, http.StatusRequestEntityTooLarge)
			return
		}
		http.Error(w, `{"message": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Title) == "" {
		http.Error(w, `{"message": "Title is required"}`, http.StatusBadRequest)
		return
	}

	now := time.Now().UTC()
	todo := models.Todo{
		Id:        uuid.New().String(),
		Title:     req.Title,
		Completed: false,
		UserId:    userId,
		CreatedAt: now,
		UpdatedAt: now,
	}

	if err := h.todoRepo.AddTodo(todo); err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(todo)
}

func (h *TodoHandler) Get(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserIdKey).(string)
	if !ok {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}
	id := r.PathValue("id")

	todo, err := h.todoRepo.GetTodoById(id)
	if err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	if todo == nil || todo.UserId != userId {
		http.Error(w, `{"message": "Not found"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(todo)
}

func (h *TodoHandler) Update(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserIdKey).(string)
	if !ok {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}
	id := r.PathValue("id")

	todo, err := h.todoRepo.GetTodoById(id)
	if err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	if todo == nil || todo.UserId != userId {
		http.Error(w, `{"message": "Not found"}`, http.StatusNotFound)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1048576)
	var req UpdateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		if err.Error() == "http: request body too large" {
			http.Error(w, `{"message": "Request body too large"}`, http.StatusRequestEntityTooLarge)
			return
		}
		http.Error(w, `{"message": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if req.Title != nil {
		todo.Title = *req.Title
	}
	if req.Completed != nil {
		todo.Completed = *req.Completed
	}
	todo.UpdatedAt = time.Now().UTC()

	if err := h.todoRepo.UpdateTodo(*todo); err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(todo)
}

func (h *TodoHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(middleware.UserIdKey).(string)
	if !ok {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}
	id := r.PathValue("id")

	todo, err := h.todoRepo.GetTodoById(id)
	if err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	if todo == nil || todo.UserId != userId {
		http.Error(w, `{"message": "Not found"}`, http.StatusNotFound)
		return
	}

	if err := h.todoRepo.DeleteTodo(id); err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
