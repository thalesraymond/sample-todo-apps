package repositories

import (
	"github.com/stretchr/testify/assert"
	"github.com/todo-app/go/internal/models"
	"testing"
)

func TestInMemoryTodoRepository(t *testing.T) {
	repo := NewInMemoryTodoRepository()

	todo := models.Todo{
		Id:     "1",
		Title:  "Test Todo",
		UserId: "user1",
	}

	// Test Add
	err := repo.AddTodo(todo)
	assert.NoError(t, err)

	// Test GetById
	foundTodo, err := repo.GetTodoById("1")
	assert.NoError(t, err)
	assert.NotNil(t, foundTodo)
	assert.Equal(t, "Test Todo", foundTodo.Title)

	// Test GetById Not Found
	notFoundTodo, err := repo.GetTodoById("2")
	assert.NoError(t, err)
	assert.Nil(t, notFoundTodo)

	// Test GetTodosByUserId
	todo2 := models.Todo{
		Id:     "2",
		Title:  "Test Todo 2",
		UserId: "user1",
	}
	_ = repo.AddTodo(todo2)

	userTodos, err := repo.GetTodosByUserId("user1")
	assert.NoError(t, err)
	assert.Len(t, userTodos, 2)

	// Test GetTodosByUserId Empty
	emptyTodos, err := repo.GetTodosByUserId("user2")
	assert.NoError(t, err)
	assert.Len(t, emptyTodos, 0)

	// Test Update
	foundTodo.Title = "Updated Todo"
	err = repo.UpdateTodo(*foundTodo)
	assert.NoError(t, err)

	updatedTodo, _ := repo.GetTodoById("1")
	assert.Equal(t, "Updated Todo", updatedTodo.Title)

	// Test Delete
	err = repo.DeleteTodo("1")
	assert.NoError(t, err)

	deletedTodo, _ := repo.GetTodoById("1")
	assert.Nil(t, deletedTodo)
}
