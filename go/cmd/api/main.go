package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/rs/cors"
	"github.com/todo-app/go/internal/handlers"
	"github.com/todo-app/go/internal/middleware"
	"github.com/todo-app/go/internal/repositories"
	"github.com/todo-app/go/internal/services"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is required")
	}

	userRepo := repositories.NewInMemoryUserRepository()
	todoRepo := repositories.NewInMemoryTodoRepository()
	jwtService := services.NewJwtService(jwtSecret)

	authHandler := handlers.NewAuthHandler(userRepo, jwtService)
	todoHandler := handlers.NewTodoHandler(todoRepo)
	authMiddleware := middleware.AuthMiddleware(jwtService)

	mux := http.NewServeMux()

	// Health
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":   "ok",
			"database": "ok",
		})
	})

	// Auth
	mux.HandleFunc("POST /api/auth/register", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		authHandler.Register(w, r)
	})
	mux.HandleFunc("POST /api/auth/login", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		authHandler.Login(w, r)
	})

	// Protected Todo Routes
	protectedMux := http.NewServeMux()
	protectedMux.HandleFunc("GET /todos", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		todoHandler.List(w, r)
	})
	protectedMux.HandleFunc("POST /todos", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		todoHandler.Create(w, r)
	})
	protectedMux.HandleFunc("GET /todos/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		todoHandler.Get(w, r)
	})
	protectedMux.HandleFunc("PUT /todos/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		todoHandler.Update(w, r)
	})
	protectedMux.HandleFunc("DELETE /todos/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		todoHandler.Delete(w, r)
	})

	mux.Handle("/todos", authMiddleware(protectedMux))
	mux.Handle("/todos/", authMiddleware(protectedMux))

	allowedOriginsStr := os.Getenv("CORS_ORIGIN")
	if allowedOriginsStr == "" {
		allowedOriginsStr = "http://localhost:5173" // Default frontend port
	}
	allowedOrigins := []string{allowedOriginsStr}

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(mux)

	server := &http.Server{
		Addr:              fmt.Sprintf(":%s", port),
		Handler:           corsHandler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	log.Printf("Server starting on port %s", port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
