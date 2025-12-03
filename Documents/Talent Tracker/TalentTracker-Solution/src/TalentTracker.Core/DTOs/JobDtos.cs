namespace TalentTracker.Core.DTOs;

public class CreateJobRequest
{
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Salary { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    
    // Consultant specific
    public int? EmployerId { get; set; }
}

public class JobDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public int? CompanyId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Salary { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();
    public string Description { get; set; } = string.Empty;
    public int PostedBy { get; set; }
    public string PostedByName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsPerfectMatch { get; set; }
    public string? ApplicationStatus { get; set; } // Applied, Shortlisted, etc.
    public string Experience { get; set; } = string.Empty;

    // Consultant specific
    public int? ConsultantId { get; set; }
    public int? EmployerId { get; set; }
    public string EmployerName { get; set; } = string.Empty;
}
