package repositories

import (
	"github.com/todo-app/go/internal/models"
	"sync"
)

type TodoRepository interface {
	AddTodo(todo models.Todo) error
	GetTodoById(id string) (*models.Todo, error)
	GetTodosByUserId(userId string) ([]models.Todo, error)
	UpdateTodo(todo models.Todo) error
	DeleteTodo(id string) error
}

type InMemoryTodoRepository struct {
	mu    sync.RWMutex
	todos map[string]models.Todo
}

func NewInMemoryTodoRepository() *InMemoryTodoRepository {
	return &InMemoryTodoRepository{
		todos: make(map[string]models.Todo),
	}
}

func (r *InMemoryTodoRepository) AddTodo(todo models.Todo) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.todos[todo.Id] = todo
	return nil
}

func (r *InMemoryTodoRepository) GetTodoById(id string) (*models.Todo, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if todo, exists := r.todos[id]; exists {
		return &todo, nil
	}

	return nil, nil // Return nil, nil when not found
}

func (r *InMemoryTodoRepository) GetTodosByUserId(userId string) ([]models.Todo, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var userTodos []models.Todo
	for _, todo := range r.todos {
		if todo.UserId == userId {
			userTodos = append(userTodos, todo)
		}
	}

	// Return empty slice instead of nil to play nice with JSON serialization
	if userTodos == nil {
		userTodos = []models.Todo{}
	}

	return userTodos, nil
}

func (r *InMemoryTodoRepository) UpdateTodo(todo models.Todo) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.todos[todo.Id]; exists {
		r.todos[todo.Id] = todo
	}

	return nil
}

func (r *InMemoryTodoRepository) DeleteTodo(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.todos, id)
	return nil
}
