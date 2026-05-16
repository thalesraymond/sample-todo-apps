package middleware

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/todo-app/go/internal/services"
)

func TestAuthMiddleware(t *testing.T) {
	// Initialize the JWT service with a test secret
	secretKey := "test_secret_key"
	jwtService := services.NewJwtService(secretKey)

	// Create a valid token for testing
	validToken, err := jwtService.GenerateToken("user-123", "test@example.com")
	assert.NoError(t, err)

	// Create an invalid token (signed with different secret)
	wrongSecretService := services.NewJwtService("wrong_secret_key")
	invalidToken, err := wrongSecretService.GenerateToken("user-123", "test@example.com")
	assert.NoError(t, err)

	// Create a token with no subject
	noSubTokenClaims := jwt.MapClaims{
		"email": "test@example.com",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}
	noSubTokenJwt := jwt.NewWithClaims(jwt.SigningMethodHS256, noSubTokenClaims)
	noSubToken, err := noSubTokenJwt.SignedString([]byte(secretKey))
	assert.NoError(t, err)

	// Create a token with invalid subject type
	invalidSubTypeClaims := jwt.MapClaims{
		"sub":   123, // Should be string
		"email": "test@example.com",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}
	invalidSubTypeJwt := jwt.NewWithClaims(jwt.SigningMethodHS256, invalidSubTypeClaims)
	invalidSubTypeToken, err := invalidSubTypeJwt.SignedString([]byte(secretKey))
	assert.NoError(t, err)

	tests := []struct {
		name               string
		authHeader         string
		expectedStatus     int
		expectedBody       string
		expectedContextSet bool
		expectedUserId     string
	}{
		{
			name:               "Missing Authorization header",
			authHeader:         "",
			expectedStatus:     http.StatusUnauthorized,
			expectedBody:       `{"message": "Unauthorized"}` + "\n",
			expectedContextSet: false,
		},
		{
			name:               "Invalid format (no Bearer)",
			authHeader:         "Token " + validToken,
			expectedStatus:     http.StatusUnauthorized,
			expectedBody:       `{"message": "Invalid authorization header format"}` + "\n",
			expectedContextSet: false,
		},
		{
			name:               "Invalid format (missing token)",
			authHeader:         "Bearer",
			expectedStatus:     http.StatusUnauthorized,
			expectedBody:       `{"message": "Invalid authorization header format"}` + "\n",
			expectedContextSet: false,
		},
		{
			name:               "Invalid format (too many parts)",
			authHeader:         "Bearer " + validToken + " extra",
			expectedStatus:     http.StatusUnauthorized,
			expectedBody:       `{"message": "Invalid authorization header format"}` + "\n",
			expectedContextSet: false,
		},
		{
			name:               "Invalid token (wrong signature)",
			authHeader:         "Bearer " + invalidToken,
			expectedStatus:     http.StatusUnauthorized,
			expectedBody:       `{"message": "Invalid token"}` + "\n",
			expectedContextSet: false,
		},
		{
			name:               "Invalid token subject (missing sub)",
			authHeader:         "Bearer " + noSubToken,
			expectedStatus:     http.StatusUnauthorized,
			expectedBody:       `{"message": "Invalid token subject"}` + "\n",
			expectedContextSet: false,
		},
		{
			name:               "Invalid token subject (wrong type)",
			authHeader:         "Bearer " + invalidSubTypeToken,
			expectedStatus:     http.StatusUnauthorized,
			expectedBody:       `{"message": "Invalid token subject"}` + "\n",
			expectedContextSet: false,
		},
		{
			name:               "Valid token",
			authHeader:         "Bearer " + validToken,
			expectedStatus:     http.StatusOK,
			expectedBody:       "Success",
			expectedContextSet: true,
			expectedUserId:     "user-123",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Mock handler to verify context is set correctly
			var contextUserId string
			var contextSet bool

			nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				val := r.Context().Value(UserIdKey)
				if val != nil {
					contextSet = true
					contextUserId = val.(string)
				}
				w.WriteHeader(http.StatusOK)
				fmt.Fprint(w, "Success")
			})

			// Set up middleware
			middleware := AuthMiddleware(jwtService)
			handlerToTest := middleware(nextHandler)

			// Create request and recorder
			req := httptest.NewRequest(http.MethodGet, "/", nil)
			if tt.authHeader != "" {
				req.Header.Set("Authorization", tt.authHeader)
			}
			rr := httptest.NewRecorder()

			// Run the middleware
			handlerToTest.ServeHTTP(rr, req)

			// Assertions
			assert.Equal(t, tt.expectedStatus, rr.Code)
			assert.Equal(t, tt.expectedBody, rr.Body.String())
			assert.Equal(t, tt.expectedContextSet, contextSet)
			if tt.expectedContextSet {
				assert.Equal(t, tt.expectedUserId, contextUserId)
			}
		})
	}
}
