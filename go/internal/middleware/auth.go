package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/todo-app/go/internal/services"
)

type contextKey string

const UserIdKey contextKey = "userId"

func AuthMiddleware(jwtService *services.JwtService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, `{"message": "Unauthorized"}`, http.StatusUnauthorized)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, `{"message": "Invalid authorization header format"}`, http.StatusUnauthorized)
				return
			}

			tokenString := parts[1]
			claims, err := jwtService.VerifyToken(tokenString)
			if err != nil {
				http.Error(w, `{"message": "Invalid token"}`, http.StatusUnauthorized)
				return
			}

			userId, ok := claims["sub"].(string)
			if !ok {
				http.Error(w, `{"message": "Invalid token subject"}`, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserIdKey, userId)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
