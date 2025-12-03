using TalentTracker.Core.Enums;

namespace TalentTracker.Core.DTOs;

public class CompanyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public CompanyType Type { get; set; }
    public EntityStatus Status { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Email { get; set; } // Added for frontend display
}
