namespace TalentTracker.Core.DTOs;

public class DashboardStatsDto
{
    // Seeker Stats
    public int JobsApplied { get; set; }
    public int Interviews { get; set; }
    public int Shortlisted { get; set; }

    // Employer/Consultant Stats
    public int ActivePosts { get; set; }
    public int TotalCompanyJobs { get; set; }
    public int PendingReview { get; set; }

    // Admin Stats
    public int TotalUsers { get; set; }
    public int RegisteredCompanies { get; set; }
    public int BlockedEntities { get; set; }
}
