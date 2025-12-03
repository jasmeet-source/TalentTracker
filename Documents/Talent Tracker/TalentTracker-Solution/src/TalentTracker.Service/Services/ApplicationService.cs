using TalentTracker.Core.DTOs;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Enums;
using TalentTracker.Core.Interfaces;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class ApplicationService : IApplicationService
{
    private readonly IRepository<Application> _applicationRepository;
    private readonly IRepository<Job> _jobRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Company> _companyRepository;
    private readonly INotificationService _notificationService;

    public ApplicationService(
        IRepository<Application> applicationRepository, 
        IRepository<Job> jobRepository, 
        IRepository<User> userRepository,
        IRepository<Company> companyRepository,
        INotificationService notificationService)
    {
        _applicationRepository = applicationRepository;
        _jobRepository = jobRepository;
        _userRepository = userRepository;
        _companyRepository = companyRepository;
        _notificationService = notificationService;
    }

    public async Task<ApplicationDto> ApplyAsync(int jobId, int applicantId)
    {
        var existing = await _applicationRepository.FindAsync(a => a.JobId == jobId && a.ApplicantId == applicantId);
        if (existing.Any())
        {
            throw new Exception("Already applied");
        }

        var application = new Application
        {
            JobId = jobId,
            ApplicantId = applicantId,
            Status = ApplicationStatus.Pending,
            DateApplied = DateTime.UtcNow
        };

        await _applicationRepository.AddAsync(application);

        // Notify Employer/Poster
        var job = await _jobRepository.GetByIdAsync(jobId);
        if (job != null)
        {
            await _notificationService.CreateNotificationAsync(job.PostedBy, $"New application received for job: {job.Title}");
        }

        return await MapToDto(application);
    }

    public async Task<IEnumerable<ApplicationDto>> GetApplicationsByJobAsync(int jobId)
    {
        var apps = await _applicationRepository.FindAsync(a => a.JobId == jobId);
        var dtos = new List<ApplicationDto>();
        foreach (var app in apps)
        {
            dtos.Add(await MapToDto(app));
        }
        return dtos;
    }

    public async Task<IEnumerable<ApplicationDto>> GetApplicationsByUserAsync(int userId)
    {
        var apps = await _applicationRepository.FindAsync(a => a.ApplicantId == userId);
        var dtos = new List<ApplicationDto>();
        foreach (var app in apps)
        {
            dtos.Add(await MapToDto(app));
        }
        return dtos;
    }

    public async Task UpdateStatusAsync(int applicationId, string status, InterviewDto? interview = null)
    {
        var app = await _applicationRepository.GetByIdAsync(applicationId);
        if (app != null)
        {
            if (Enum.TryParse<ApplicationStatus>(status, true, out var statusEnum))
            {
                app.Status = statusEnum;
                
                if (statusEnum == ApplicationStatus.Shortlisted)
                {
                    if (interview != null)
                    {
                        DateTime? interviewDate = null;
                        if (DateTime.TryParse(interview.Date, out var parsedDate))
                        {
                            interviewDate = parsedDate;
                        }

                        app.Interview = new InterviewDetails
                        {
                            Date = interviewDate,
                            Time = interview.Time,
                            Location = interview.Location,
                            Link = interview.Link,
                            ContactPerson = interview.ContactPerson,
                            ContactEmail = interview.ContactEmail,
                            ContactPhone = interview.ContactPhone,
                            Notes = interview.Notes
                        };
                    }
                    else if (app.Interview == null)
                    {
                        // Default fallback if no details provided
                        app.Interview = new InterviewDetails
                        {
                            Date = DateTime.UtcNow.AddDays(7),
                            Time = "10:00 AM",
                            Location = "Virtual",
                            Link = "meet.google.com/abc-def-ghi"
                        };
                    }
                }

                await _applicationRepository.UpdateAsync(app);

                // Notify Applicant
                var job = await _jobRepository.GetByIdAsync(app.JobId);
                string jobTitle = job?.Title ?? "a job";
                await _notificationService.CreateNotificationAsync(app.ApplicantId, $"Your application for {jobTitle} has been updated to: {status}");
            }
        }
    }

    private async Task<ApplicationDto> MapToDto(Application app)
    {
        var job = await _jobRepository.GetByIdAsync(app.JobId);
        var applicant = await _userRepository.GetByIdAsync(app.ApplicantId);
        string companyName = "Unknown";
        string jobTitle = "Unknown";
        
        if (job != null)
        {
            jobTitle = job.Title;
            if (job.CompanyId.HasValue)
            {
                var company = await _companyRepository.GetByIdAsync(job.CompanyId.Value);
                if (company != null) companyName = company.Name;
            }
        }

        return new ApplicationDto
        {
            Id = app.Id,
            JobId = app.JobId,
            JobTitle = jobTitle,
            CompanyName = companyName,
            ApplicantId = app.ApplicantId,
            ApplicantName = applicant?.Name ?? "Unknown",
            ResumeUrl = applicant?.ResumeUrl ?? "",
            Status = app.Status.ToString(),
            DateApplied = app.DateApplied,
            Interview = app.Interview == null ? null : new InterviewDto
            {
                Date = app.Interview.Date?.ToString("yyyy-MM-dd") ?? "",
                Time = app.Interview.Time ?? "",
                Location = app.Interview.Location ?? "",
                Link = app.Interview.Link ?? "",
                ContactPerson = app.Interview.ContactPerson ?? "",
                ContactEmail = app.Interview.ContactEmail ?? "",
                ContactPhone = app.Interview.ContactPhone ?? "",
                Notes = app.Interview.Notes ?? ""
            }
        };
    }
}
