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
	mu        sync.RWMutex
	todos     map[string]models.Todo
	userTodos map[string]map[string]struct{}
}

func NewInMemoryTodoRepository() *InMemoryTodoRepository {
	return &InMemoryTodoRepository{
		todos:     make(map[string]models.Todo),
		userTodos: make(map[string]map[string]struct{}),
	}
}

func (r *InMemoryTodoRepository) AddTodo(todo models.Todo) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if oldTodo, exists := r.todos[todo.Id]; exists {
		if oldTodo.UserId != todo.UserId {
			if r.userTodos[oldTodo.UserId] != nil {
				delete(r.userTodos[oldTodo.UserId], todo.Id)
			}
		}
	}

	r.todos[todo.Id] = todo
	if r.userTodos[todo.UserId] == nil {
		r.userTodos[todo.UserId] = make(map[string]struct{})
	}
	r.userTodos[todo.UserId][todo.Id] = struct{}{}
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
	if todoIds, exists := r.userTodos[userId]; exists {
		userTodos = make([]models.Todo, 0, len(todoIds))
		for id := range todoIds {
			if todo, ok := r.todos[id]; ok {
				userTodos = append(userTodos, todo)
			}
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

	if oldTodo, exists := r.todos[todo.Id]; exists {
		if oldTodo.UserId != todo.UserId {
			if r.userTodos[oldTodo.UserId] != nil {
				delete(r.userTodos[oldTodo.UserId], todo.Id)
			}
			if r.userTodos[todo.UserId] == nil {
				r.userTodos[todo.UserId] = make(map[string]struct{})
			}
			r.userTodos[todo.UserId][todo.Id] = struct{}{}
		}
		r.todos[todo.Id] = todo
	}

	return nil
}

func (r *InMemoryTodoRepository) DeleteTodo(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if todo, exists := r.todos[id]; exists {
		delete(r.todos, id)
		if r.userTodos[todo.UserId] != nil {
			delete(r.userTodos[todo.UserId], id)
		}
	}
	return nil
}
