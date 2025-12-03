using TalentTracker.Core.Enums;

namespace TalentTracker.Core.Entities;

public class ConsultantEmployer : BaseEntity
{
    public int EmployerId { get; set; }
    public User? Employer { get; set; }

    public int ConsultantId { get; set; }
    public User? Consultant { get; set; }

    public ConsultantEmployerStatus Status { get; set; } = ConsultantEmployerStatus.Pending;
    public DateTime DateRequested { get; set; } = DateTime.UtcNow;
    public DateTime? DateActioned { get; set; }
    public string? RequestNote { get; set; }
}
