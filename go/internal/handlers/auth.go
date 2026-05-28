package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/todo-app/go/internal/models"
	"github.com/todo-app/go/internal/repositories"
	"github.com/todo-app/go/internal/services"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	userRepo   repositories.UserRepository
	jwtService *services.JwtService
}

func NewAuthHandler(userRepo repositories.UserRepository, jwtService *services.JwtService) *AuthHandler {
	return &AuthHandler{
		userRepo:   userRepo,
		jwtService: jwtService,
	}
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1048576)
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			http.Error(w, `{"message": "Request body too large"}`, http.StatusRequestEntityTooLarge)
			return
		}
		http.Error(w, `{"message": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" {
		http.Error(w, `{"message": "Email and password are required"}`, http.StatusBadRequest)
		return
	}

	existingUser, err := h.userRepo.GetUserByEmail(req.Email)
	if err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}
	if existingUser != nil {
		http.Error(w, `{"message": "Email already registered"}`, http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	user := models.User{
		Id:       uuid.New().String(),
		Email:    req.Email,
		Password: string(hashedPassword),
	}

	if err := h.userRepo.AddUser(user); err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User registered successfully",
		"userId":  user.Id,
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1048576)
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			http.Error(w, `{"message": "Request body too large"}`, http.StatusRequestEntityTooLarge)
			return
		}
		http.Error(w, `{"message": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" {
		http.Error(w, `{"message": "Email and password are required"}`, http.StatusBadRequest)
		return
	}

	user, _ := h.userRepo.GetUserByEmail(req.Email)
	if user == nil {
		http.Error(w, `{"message": "Invalid credentials"}`, http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		http.Error(w, `{"message": "Invalid credentials"}`, http.StatusUnauthorized)
		return
	}

	token, err := h.jwtService.GenerateToken(user.Id, user.Email)
	if err != nil {
		http.Error(w, `{"message": "Internal server error"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}
