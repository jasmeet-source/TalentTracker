using TalentTracker.Core.Enums;

namespace TalentTracker.Core.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public EntityStatus Status { get; set; } = EntityStatus.Active;
    
    // Seeker specific
    public string? Skills { get; set; } // Comma separated
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PinCode { get; set; }
    public string? Phone { get; set; }
    public string? Fax { get; set; }
    public DateTime? DOB { get; set; }
    public string? Qualification { get; set; }
    public string? ResumeUrl { get; set; }
    public string? DesiredJob { get; set; }
    public int? ExperienceYears { get; set; }
    public string? Summary { get; set; }

    // Employer/Consultant specific
    public int? CompanyId { get; set; }
    public Company? Company { get; set; }

    // Navigation properties
    public ICollection<Job> PostedJobs { get; set; } = new List<Job>();
    public ICollection<Job> ConsultantJobs { get; set; } = new List<Job>();
    public ICollection<Job> EmployerJobs { get; set; } = new List<Job>();
    public ICollection<Application> Applications { get; set; } = new List<Application>();
    public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
