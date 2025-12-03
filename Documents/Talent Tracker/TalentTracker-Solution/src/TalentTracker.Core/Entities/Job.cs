using TalentTracker.Core.Enums;

namespace TalentTracker.Core.Entities;

public class Job : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public int? CompanyId { get; set; }
    public Company? Company { get; set; }
    
    public int PostedBy { get; set; }
    public User? Poster { get; set; }

    // Consultant specific
    public int? ConsultantId { get; set; }
    public User? Consultant { get; set; }

    public int? EmployerId { get; set; }
    public User? Employer { get; set; }

    public string Type { get; set; } = string.Empty; // Full-time, Contract, etc.
    public string Location { get; set; } = string.Empty;
    public string SalaryRange { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty; // e.g. "2+ years", "No experience required"
    public JobStatus Status { get; set; } = JobStatus.Open;
    public string Skills { get; set; } = string.Empty; // Comma separated or JSON
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
