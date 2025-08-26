package auth

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// JWTConfig holds JWT configuration
type JWTConfig struct {
	Secret string
}

// Claims represents JWT claims
type Claims struct {
	Sub   string `json:"sub"`
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

// JWTMiddleware creates JWT authentication middleware
func JWTMiddleware(secret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Authorization header required",
			})
		}

		// Check if it's a Bearer token
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid authorization header format",
			})
		}

		// Extract token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse and validate token
		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			// Validate signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		})

		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token",
			})
		}

		// Check if token is valid
		if !token.Valid {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token",
			})
		}

		// Extract claims
		claims, ok := token.Claims.(*Claims)
		if !ok {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token claims",
			})
		}

		// Add user info to context
		c.Locals("user_id", claims.Sub)
		c.Locals("user_email", claims.Email)
		c.Locals("user_role", claims.Role)

		return c.Next()
	}
}

// GetUserID extracts user ID from context
func GetUserID(c *fiber.Ctx) string {
	if userID, ok := c.Locals("user_id").(string); ok {
		return userID
	}
	return ""
}

// GetUserEmail extracts user email from context
func GetUserEmail(c *fiber.Ctx) string {
	if userEmail, ok := c.Locals("user_email").(string); ok {
		return userEmail
	}
	return ""
}

// GetUserRole extracts user role from context
func GetUserRole(c *fiber.Ctx) string {
	if userRole, ok := c.Locals("user_role").(string); ok {
		return userRole
	}
	return ""
}

// RequireRole creates middleware that requires a specific role
func RequireRole(requiredRole string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole := GetUserRole(c)
		if userRole != requiredRole {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{
				"error": "Insufficient permissions",
			})
		}
		return c.Next()
	}
}
