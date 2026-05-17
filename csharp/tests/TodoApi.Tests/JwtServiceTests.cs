using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using FluentAssertions;
using TodoApi.Services;
using Xunit;

namespace TodoApi.Tests;

public class JwtServiceTests
{
    private const string SecretKey = "my_super_secret_key_that_is_at_least_32_characters_long!";
    private const string Issuer = "TodoApi";
    private const string Audience = "TodoApiClient";

    [Fact]
    public void GenerateToken_ShouldIncludeUserIdAndEmailClaims()
    {
        // Arrange
        var service = new JwtService(SecretKey, Issuer, Audience);
        var userId = "user123";
        var email = "test@example.com";

        // Act
        var tokenString = service.GenerateToken(userId, email);

        // Assert
        tokenString.Should().NotBeNullOrEmpty();

        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(tokenString);

        token.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == userId);
        token.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Email && c.Value == email);
    }

    [Fact]
    public void GenerateToken_ShouldSetExpirationToSevenDays()
    {
        // Arrange
        var service = new JwtService(SecretKey, Issuer, Audience);

        // Act
        var tokenString = service.GenerateToken("u1", "test@example.com");

        // Assert
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(tokenString);

        // Allow some tolerance for execution time
        token.ValidTo.Should().BeCloseTo(DateTime.UtcNow.AddDays(7), TimeSpan.FromMinutes(1));
    }

    [Fact]
    public void GenerateToken_WithNullUserId_ThrowsArgumentNullException()
    {
        // Arrange
        var service = new JwtService(SecretKey, Issuer, Audience);

        // Act
        Action act = () => service.GenerateToken(null!, "test@example.com");

        // Assert
        act.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void GenerateToken_WithNullEmail_ThrowsArgumentNullException()
    {
        // Arrange
        var service = new JwtService(SecretKey, Issuer, Audience);

        // Act
        Action act = () => service.GenerateToken("u1", null!);

        // Assert
        act.Should().Throw<ArgumentNullException>();
    }
}
