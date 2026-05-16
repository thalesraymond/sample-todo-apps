package repositories

import (
	"github.com/stretchr/testify/assert"
	"github.com/todo-app/go/internal/models"
	"testing"
)

func TestInMemoryUserRepository(t *testing.T) {
	repo := NewInMemoryUserRepository()

	user := models.User{
		Id:       "1",
		Email:    "test@example.com",
		Password: "hashedpassword",
	}

	err := repo.AddUser(user)
	assert.NoError(t, err)

	foundUser, err := repo.GetUserByEmail("test@example.com")
	assert.NoError(t, err)
	assert.NotNil(t, foundUser)
	assert.Equal(t, "1", foundUser.Id)

	notFoundUser, err := repo.GetUserByEmail("notfound@example.com")
	assert.NoError(t, err)
	assert.Nil(t, notFoundUser)
}
