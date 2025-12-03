namespace TalentTracker.Core.Enums;

public enum UserRole
{
    Seeker,
    Employer,
    Consultant,
    Admin
}

public enum CompanyType
{
    Employer,
    Consultancy
}

public enum JobStatus
{
    Open,
    Closed
}

public enum ApplicationStatus
{
    Pending,
    Shortlisted,
    Rejected
}

public enum ComplaintStatus
{
    Pending,
    Resolved
}

public enum EntityStatus
{
    Active,
    Blocked
}

public enum ConsultantEmployerStatus
{
    Pending,
    Approved,
    Rejected
}
