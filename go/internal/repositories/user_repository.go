package repositories

import (
	"github.com/todo-app/go/internal/models"
	"sync"
)

type UserRepository interface {
	AddUser(user models.User) error
	GetUserByEmail(email string) (*models.User, error)
}

type InMemoryUserRepository struct {
	mu    sync.RWMutex
	users map[string]models.User
}

func NewInMemoryUserRepository() *InMemoryUserRepository {
	return &InMemoryUserRepository{
		users: make(map[string]models.User),
	}
}

func (r *InMemoryUserRepository) AddUser(user models.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.users[user.Email] = user
	return nil
}

func (r *InMemoryUserRepository) GetUserByEmail(email string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if user, exists := r.users[email]; exists {
		return &user, nil
	}

	return nil, nil // Return nil, nil when not found
}
