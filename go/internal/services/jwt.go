package services

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JwtService struct {
	secretKey string
}

func NewJwtService(secretKey string) *JwtService {
	return &JwtService{secretKey: secretKey}
}

func (s *JwtService) GenerateToken(userId, email string) (string, error) {
	claims := jwt.MapClaims{
		"sub":   userId,
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.secretKey))
}

func (s *JwtService) VerifyToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(s.secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrTokenInvalidClaims
}
