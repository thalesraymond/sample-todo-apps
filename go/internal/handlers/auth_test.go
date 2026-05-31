package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/todo-app/go/internal/models"
	"github.com/todo-app/go/internal/repositories"
	"github.com/todo-app/go/internal/services"
	"golang.org/x/crypto/bcrypt"
)

func TestAuthHandler_Register(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	// Test successful registration
	reqBody := `{"email":"test@example.com","password":"password123"}`
	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.Register(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	// Test duplicate email
	req2 := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBufferString(reqBody))
	req2.Header.Set("Content-Type", "application/json")
	w2 := httptest.NewRecorder()

	handler.Register(w2, req2)
	assert.Equal(t, http.StatusBadRequest, w2.Code)
}

func TestAuthHandler_Login(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	repo.AddUser(models.User{
		Id:       "1",
		Email:    "test@example.com",
		Password: string(hashedPassword),
	})

	// Test successful login
	reqBody := `{"email":"test@example.com","password":"password123"}`
	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.Login(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]string
	json.NewDecoder(w.Body).Decode(&resp)
	assert.NotEmpty(t, resp["token"])

	// Test invalid password
	reqBodyInvalid := `{"email":"test@example.com","password":"wrongpassword"}`
	reqInvalid := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(reqBodyInvalid))
	reqInvalid.Header.Set("Content-Type", "application/json")
	wInvalid := httptest.NewRecorder()

	handler.Login(wInvalid, reqInvalid)

	assert.Equal(t, http.StatusUnauthorized, wInvalid.Code)
}

func TestAuthHandler_Register_InvalidBody(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBufferString("{invalid json"))
	w := httptest.NewRecorder()
	handler.Register(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAuthHandler_Register_MissingFields(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBufferString(`{"email": ""}`))
	w := httptest.NewRecorder()
	handler.Register(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAuthHandler_Login_InvalidBody(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString("{invalid json"))
	w := httptest.NewRecorder()
	handler.Login(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAuthHandler_Login_MissingFields(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(`{"email": ""}`))
	w := httptest.NewRecorder()
	handler.Login(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAuthHandler_Login_NotFound(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(`{"email": "notfound@example.com", "password":"test"}`))
	w := httptest.NewRecorder()
	handler.Login(w, req)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

type mockErrorUserRepository struct{}

func (m *mockErrorUserRepository) AddUser(user models.User) error {
	return assert.AnError
}

func (m *mockErrorUserRepository) GetUserByEmail(email string) (*models.User, error) {
	return nil, nil
}

func TestAuthHandler_Register_RepoError(t *testing.T) {
	repo := &mockErrorUserRepository{}
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	reqBody := `{"email":"test@example.com","password":"password123"}`
	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.Register(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func TestAuthHandler_Register_TooLarge(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	// Create 2MB payload
	largeStr := make([]byte, 2097152)
	for i := range largeStr {
		largeStr[i] = 'a'
	}
	reqBody := `{"email":"` + string(largeStr) + `@test.com","password":"pwd"}`

	req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBufferString(reqBody))
	w := httptest.NewRecorder()
	handler.Register(w, req)
	assert.Equal(t, http.StatusRequestEntityTooLarge, w.Code)
}

func TestAuthHandler_Login_TooLarge(t *testing.T) {
	repo := repositories.NewInMemoryUserRepository()
	jwtService := services.NewJwtService("secret")
	handler := NewAuthHandler(repo, jwtService)

	// Create 2MB payload
	largeStr := make([]byte, 2097152)
	for i := range largeStr {
		largeStr[i] = 'a'
	}
	reqBody := `{"email":"` + string(largeStr) + `@test.com","password":"pwd"}`

	req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewBufferString(reqBody))
	w := httptest.NewRecorder()
	handler.Login(w, req)
	assert.Equal(t, http.StatusRequestEntityTooLarge, w.Code)
}
