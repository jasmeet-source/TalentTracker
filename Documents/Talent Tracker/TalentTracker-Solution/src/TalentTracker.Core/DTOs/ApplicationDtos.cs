namespace TalentTracker.Core.DTOs;

public class ApplicationDto
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public int ApplicantId { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string ResumeUrl { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime DateApplied { get; set; }
    public InterviewDto? Interview { get; set; }
}

public class InterviewDto
{
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class UpdateApplicationStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public InterviewDto? Interview { get; set; }
}
