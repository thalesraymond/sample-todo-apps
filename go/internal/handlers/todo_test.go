package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/todo-app/go/internal/middleware"
	"github.com/todo-app/go/internal/models"
	"github.com/todo-app/go/internal/repositories"
)

func setContext(req *http.Request, userId string) *http.Request {
	ctx := context.WithValue(req.Context(), middleware.UserIdKey, userId)
	return req.WithContext(ctx)
}

func TestTodoHandler_Create(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	reqBody := `{"title":"New Todo"}`
	req := httptest.NewRequest(http.MethodPost, "/todos", bytes.NewBufferString(reqBody))
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Create(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var createdTodo models.Todo
	json.NewDecoder(w.Body).Decode(&createdTodo)
	assert.Equal(t, "New Todo", createdTodo.Title)
	assert.Equal(t, "user1", createdTodo.UserId)
	assert.False(t, createdTodo.Completed)
}

func TestTodoHandler_List(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	repo.AddTodo(models.Todo{Id: "1", Title: "Todo 1", UserId: "user1"})
	repo.AddTodo(models.Todo{Id: "2", Title: "Todo 2", UserId: "user1"})
	repo.AddTodo(models.Todo{Id: "3", Title: "Todo 3", UserId: "user2"})

	req := httptest.NewRequest(http.MethodGet, "/todos", nil)
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.List(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var todos []models.Todo
	json.NewDecoder(w.Body).Decode(&todos)
	assert.Len(t, todos, 2)
}

func TestTodoHandler_Get(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	repo.AddTodo(models.Todo{Id: "1", Title: "Todo 1", UserId: "user1"})

	req := httptest.NewRequest(http.MethodGet, "/todos/1", nil)
	req.SetPathValue("id", "1")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Get(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var todo models.Todo
	json.NewDecoder(w.Body).Decode(&todo)
	assert.Equal(t, "Todo 1", todo.Title)
}

func TestTodoHandler_Update(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	repo.AddTodo(models.Todo{Id: "1", Title: "Todo 1", UserId: "user1", Completed: false})

	reqBody := `{"title":"Updated Todo","completed":true}`
	req := httptest.NewRequest(http.MethodPut, "/todos/1", bytes.NewBufferString(reqBody))
	req.SetPathValue("id", "1")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Update(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	updated, _ := repo.GetTodoById("1")
	assert.Equal(t, "Updated Todo", updated.Title)
	assert.True(t, updated.Completed)
}

func TestTodoHandler_Delete(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	repo.AddTodo(models.Todo{Id: "1", Title: "Todo 1", UserId: "user1"})

	req := httptest.NewRequest(http.MethodDelete, "/todos/1", nil)
	req.SetPathValue("id", "1")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Delete(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)

	deleted, _ := repo.GetTodoById("1")
	assert.Nil(t, deleted)
}

func TestTodoHandler_Create_InvalidBody(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	req := httptest.NewRequest(http.MethodPost, "/todos", bytes.NewBufferString("{invalid json"))
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Create(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestTodoHandler_Create_MissingTitle(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	req := httptest.NewRequest(http.MethodPost, "/todos", bytes.NewBufferString(`{"title": "   "}`))
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Create(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestTodoHandler_Get_NotFound(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	req := httptest.NewRequest(http.MethodGet, "/todos/999", nil)
	req.SetPathValue("id", "999")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Get(w, req)
	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestTodoHandler_Get_WrongUser(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	repo.AddTodo(models.Todo{Id: "1", Title: "Todo 1", UserId: "user2"})

	req := httptest.NewRequest(http.MethodGet, "/todos/1", nil)
	req.SetPathValue("id", "1")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Get(w, req)
	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestTodoHandler_Update_NotFound(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	reqBody := `{"title":"Updated Todo"}`
	req := httptest.NewRequest(http.MethodPut, "/todos/999", bytes.NewBufferString(reqBody))
	req.SetPathValue("id", "999")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Update(w, req)
	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestTodoHandler_Update_InvalidBody(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	repo.AddTodo(models.Todo{Id: "1", Title: "Todo 1", UserId: "user1"})

	req := httptest.NewRequest(http.MethodPut, "/todos/1", bytes.NewBufferString("{invalid json"))
	req.SetPathValue("id", "1")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Update(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestTodoHandler_Delete_NotFound(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	req := httptest.NewRequest(http.MethodDelete, "/todos/999", nil)
	req.SetPathValue("id", "999")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Delete(w, req)
	assert.Equal(t, http.StatusNotFound, w.Code)
}

type mockErrorRepo struct {
	repositories.InMemoryTodoRepository
}

func (m *mockErrorRepo) GetTodosByUserId(userId string) ([]models.Todo, error) {
	return nil, assert.AnError
}

type mockDeleteErrorRepo struct {
	repositories.InMemoryTodoRepository
}

func (m *mockDeleteErrorRepo) GetTodoById(id string) (*models.Todo, error) {
	return &models.Todo{Id: id, UserId: "user1"}, nil
}

func (m *mockDeleteErrorRepo) DeleteTodo(id string) error {
	return assert.AnError
}

func TestTodoHandler_List_RepoError(t *testing.T) {
	repo := &mockErrorRepo{}
	handler := NewTodoHandler(repo)

	req := httptest.NewRequest(http.MethodGet, "/todos", nil)
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.List(w, req)
	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func TestTodoHandler_Delete_RepoError(t *testing.T) {
	repo := &mockDeleteErrorRepo{}
	handler := NewTodoHandler(repo)

	req := httptest.NewRequest(http.MethodDelete, "/todos/1", nil)
	req.SetPathValue("id", "1")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Delete(w, req)
	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func TestTodoHandler_Create_TooLarge(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	// Create 2MB payload
	largeStr := make([]byte, 2097152)
	for i := range largeStr {
		largeStr[i] = 'a'
	}
	reqBody := `{"title":"` + string(largeStr) + `"}`

	req := httptest.NewRequest(http.MethodPost, "/todos", bytes.NewBufferString(reqBody))
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Create(w, req)
	assert.Equal(t, http.StatusRequestEntityTooLarge, w.Code)
}

func TestTodoHandler_Update_TooLarge(t *testing.T) {
	repo := repositories.NewInMemoryTodoRepository()
	handler := NewTodoHandler(repo)

	repo.AddTodo(models.Todo{Id: "1", Title: "Todo 1", UserId: "user1"})

	// Create 2MB payload
	largeStr := make([]byte, 2097152)
	for i := range largeStr {
		largeStr[i] = 'a'
	}
	reqBody := `{"title":"` + string(largeStr) + `"}`

	req := httptest.NewRequest(http.MethodPut, "/todos/1", bytes.NewBufferString(reqBody))
	req.SetPathValue("id", "1")
	req = setContext(req, "user1")
	w := httptest.NewRecorder()

	handler.Update(w, req)
	assert.Equal(t, http.StatusRequestEntityTooLarge, w.Code)
}
