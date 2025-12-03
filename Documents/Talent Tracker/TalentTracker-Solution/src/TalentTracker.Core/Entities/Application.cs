using TalentTracker.Core.Enums;

namespace TalentTracker.Core.Entities;

public class Application : BaseEntity
{
    public int JobId { get; set; }
    public Job? Job { get; set; }

    public int ApplicantId { get; set; }
    public User? Applicant { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    public DateTime DateApplied { get; set; } = DateTime.UtcNow;

    // Owned Entity for Interview Details
    public InterviewDetails? Interview { get; set; }
}

public class InterviewDetails
{
    public DateTime? Date { get; set; }
    public string? Time { get; set; }
    public string? Location { get; set; }
    public string? Link { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? Notes { get; set; }
}
