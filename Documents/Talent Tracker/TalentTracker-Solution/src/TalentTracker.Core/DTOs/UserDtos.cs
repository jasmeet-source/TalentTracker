namespace TalentTracker.Core.DTOs;

public class UpdateProfileRequest
{
    public int Id { get; set; }
    public string Address { get; set; } = string.Empty;
    public string DesiredJob { get; set; } = string.Empty;
    public int? ExperienceYears { get; set; }
    public string? Summary { get; set; }
    public List<string> Skills { get; set; } = new List<string>();
}
