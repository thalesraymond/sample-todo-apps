package services

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func TestJwtService_GenerateAndVerifyToken(t *testing.T) {
	secret := "test-secret"
	service := NewJwtService(secret)
	userId := "user-123"
	email := "test@example.com"

	token, err := service.GenerateToken(userId, email)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	claims, err := service.VerifyToken(token)
	assert.NoError(t, err)
	assert.NotNil(t, claims)

	assert.Equal(t, userId, claims["sub"])
	assert.Equal(t, email, claims["email"])
	assert.True(t, claims["exp"].(float64) > float64(time.Now().Unix()))
}

func TestJwtService_VerifyInvalidToken(t *testing.T) {
	secret := "test-secret"
	service := NewJwtService(secret)

	claims, err := service.VerifyToken("invalid-token")
	assert.Error(t, err)
	assert.Nil(t, claims)
}

func TestJwtService_VerifyTokenWithWrongSecret(t *testing.T) {
	service1 := NewJwtService("secret-1")
	service2 := NewJwtService("secret-2")

	token, err := service1.GenerateToken("user-1", "user@example.com")
	assert.NoError(t, err)

	claims, err := service2.VerifyToken(token)
	assert.Error(t, err)
	assert.Nil(t, claims)
}

func TestJwtService_VerifyTokenWrongSigningMethod(t *testing.T) {
	service := NewJwtService("secret")

	token := jwt.NewWithClaims(jwt.SigningMethodNone, jwt.MapClaims{"sub": "123"})
	tokenString, _ := token.SignedString(jwt.UnsafeAllowNoneSignatureType)

	claims, err := service.VerifyToken(tokenString)
	assert.Error(t, err)
	assert.Nil(t, claims)
}

func TestJwtService_VerifyTokenInvalidClaims(t *testing.T) {
	service := NewJwtService("secret")

	// creating a token that is technically signed right but maybe expired
	claims := jwt.MapClaims{
		"sub": "user1",
		"exp": time.Now().Add(-time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte("secret"))

	_, err := service.VerifyToken(tokenString)
	assert.Error(t, err)
}
