using TalentTracker.Core.Enums;

namespace TalentTracker.Core.Entities;

public class Complaint : BaseEntity
{
    public int SubmittedBy { get; set; }
    public User? Submitter { get; set; }

    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ComplaintStatus Status { get; set; } = ComplaintStatus.Pending;
    public DateTime DateSubmitted { get; set; } = DateTime.UtcNow;
}
