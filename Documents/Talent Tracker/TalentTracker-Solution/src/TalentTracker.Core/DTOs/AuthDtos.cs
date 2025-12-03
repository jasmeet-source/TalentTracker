using TalentTracker.Core.Enums;

namespace TalentTracker.Core.DTOs;

public class LoginRequest
{
    public string Identifier { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty; // Used as Identifier/Username
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    
    // Optional for Company registration
    public string? CompanyName { get; set; }
    public string? CompanyType { get; set; } // Employer/Consultancy

    // Additional Fields
    public DateTime? DOB { get; set; }
    public string? Qualification { get; set; }
    public string? Skills { get; set; }
    public int? ExperienceYears { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PinCode { get; set; }
    public string? Phone { get; set; }
    public string? Fax { get; set; }
}

public class AuthResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public int? CompanyId { get; set; }
}

public class ChangePasswordRequest
{
    public int UserId { get; set; }
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
