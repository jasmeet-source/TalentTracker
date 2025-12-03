namespace TalentTracker.Core.DTOs;

public class CreateComplaintRequest
{
    public int SubmittedBy { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateComplaintStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
