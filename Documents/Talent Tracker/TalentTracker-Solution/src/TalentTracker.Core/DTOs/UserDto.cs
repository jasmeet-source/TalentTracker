using TalentTracker.Core.Enums;

namespace TalentTracker.Core.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public EntityStatus Status { get; set; }
    public string? CompanyName { get; set; }
}
