using TalentTracker.Core.DTOs;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Enums;
using TalentTracker.Core.Interfaces;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Company> _companyRepository;

    public AuthService(IRepository<User> userRepository, IRepository<Company> companyRepository)
    {
        _userRepository = userRepository;
        _companyRepository = companyRepository;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        Console.WriteLine($"Login attempt for: {request.Identifier}");
        var users = await _userRepository.FindAsync(u => u.Email == request.Identifier || u.Username == request.Identifier);
        var user = users.FirstOrDefault();

        if (user == null)
        {
            Console.WriteLine("User not found");
            throw new Exception("Invalid credentials");
        }

        Console.WriteLine($"User found: {user.Email}, Hash: {user.PasswordHash}");
        bool validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        Console.WriteLine($"Password valid: {validPassword}");

        if (!validPassword)
        {
            throw new Exception("Invalid credentials");
        }

        if (user.Status == EntityStatus.Blocked)
        {
            throw new Exception("Account is blocked");
        }

        // Validate Role
        if (!string.IsNullOrEmpty(request.Role) && !string.Equals(user.Role.ToString(), request.Role, StringComparison.OrdinalIgnoreCase))
        {
             throw new Exception("Invalid credentials for the selected role");
        }

        return new AuthResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            Token = "mock-jwt-token-" + Guid.NewGuid(), // In production, generate real JWT
            CompanyId = user.CompanyId
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if user exists (Email or Username)
        var existingUsers = await _userRepository.FindAsync(u => u.Email == request.Email || u.Username == request.Username);
        if (existingUsers.Any())
        {
            throw new Exception("User with this Email or Username already exists");
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Enum.Parse<UserRole>(request.Role, true),
            Status = EntityStatus.Active,
            
            // Map new fields
            DOB = request.DOB,
            Qualification = request.Qualification,
            Skills = request.Skills,
            ExperienceYears = request.ExperienceYears,
            Address = request.Address,
            City = request.City,
            State = request.State,
            PinCode = request.PinCode,
            Phone = request.Phone,
            Fax = request.Fax
        };

        if (user.Role == UserRole.Employer || user.Role == UserRole.Consultant)
        {
            if (!string.IsNullOrEmpty(request.CompanyName))
            {
                var company = new Company
                {
                    Name = request.CompanyName,
                    Type = request.CompanyType == "Consultancy" ? CompanyType.Consultancy : CompanyType.Employer,
                    Status = EntityStatus.Active,
                    Location = "Unknown" // Default
                };
                await _companyRepository.AddAsync(company);
                user.CompanyId = company.Id;
            }
        }

        await _userRepository.AddAsync(user);

        return new AuthResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            Token = "mock-jwt-token-" + Guid.NewGuid(),
            CompanyId = user.CompanyId
        };
    }

    public async Task<bool> ChangePasswordAsync(ChangePasswordRequest request)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
        {
            throw new Exception("Invalid old password");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _userRepository.UpdateAsync(user);
        return true;
    }
}
