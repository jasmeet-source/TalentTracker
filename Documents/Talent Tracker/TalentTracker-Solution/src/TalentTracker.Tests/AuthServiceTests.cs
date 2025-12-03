using Moq;
using Xunit;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Interfaces;
using TalentTracker.Service.Services;
using TalentTracker.Core.DTOs;
using TalentTracker.Core.Enums;
using System.Linq.Expressions;

namespace TalentTracker.Tests;

public class AuthServiceTests
{
    private readonly Mock<IRepository<User>> _mockUserRepository;
    private readonly Mock<IRepository<Company>> _mockCompanyRepository;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _mockUserRepository = new Mock<IRepository<User>>();
        _mockCompanyRepository = new Mock<IRepository<Company>>();
        _authService = new AuthService(_mockUserRepository.Object, _mockCompanyRepository.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var email = "test@example.com";
        var password = "password123";
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User { Id = 1, Email = email, PasswordHash = passwordHash, Role = UserRole.Seeker, Status = EntityStatus.Active };

        _mockUserRepository.Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
            .ReturnsAsync(new List<User> { user });

        var request = new LoginRequest { Identifier = email, Password = password, Role = "Seeker" };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(email, result.Email);
        Assert.Equal("Seeker", result.Role);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ThrowsException()
    {
        // Arrange
        var email = "test@example.com";
        var password = "password123";
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("differentpassword");
        var user = new User { Id = 1, Email = email, PasswordHash = passwordHash, Role = UserRole.Seeker, Status = EntityStatus.Active };

        _mockUserRepository.Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
            .ReturnsAsync(new List<User> { user });

        var request = new LoginRequest { Identifier = email, Password = password, Role = "Seeker" };

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(request));
    }

    [Fact]
    public async Task LoginAsync_UserNotFound_ThrowsException()
    {
        // Arrange
        _mockUserRepository.Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
            .ReturnsAsync(new List<User>());

        var request = new LoginRequest { Identifier = "nonexistent@example.com", Password = "password", Role = "Seeker" };

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(request));
    }
}
