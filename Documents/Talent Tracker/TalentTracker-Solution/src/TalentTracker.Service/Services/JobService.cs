using TalentTracker.Core.DTOs;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Enums;
using TalentTracker.Core.Interfaces;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class JobService : IJobService
{
    private readonly IRepository<Job> _jobRepository;
    private readonly IRepository<Company> _companyRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Application> _applicationRepository;

    public JobService(IRepository<Job> jobRepository, IRepository<Company> companyRepository, IRepository<User> userRepository, IRepository<Application> applicationRepository)
    {
        _jobRepository = jobRepository;
        _companyRepository = companyRepository;
        _userRepository = userRepository;
        _applicationRepository = applicationRepository;
    }

    public async Task<JobDto> PostJobAsync(CreateJobRequest request, int userId, int? companyId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");

        int? finalCompanyId = companyId;
        int? consultantId = null;
        int? employerId = null;

        if (user.Role == UserRole.Consultant)
        {
            if (!request.EmployerId.HasValue)
            {
                throw new Exception("Employer is required for consultant job posting");
            }

            var employer = await _userRepository.GetByIdAsync(request.EmployerId.Value);
            if (employer == null || employer.Role != UserRole.Employer)
            {
                throw new Exception("Invalid employer selected");
            }

            consultantId = userId;
            employerId = request.EmployerId.Value;
            finalCompanyId = employer.CompanyId; // Use Employer's Company
        }

        var job = new Job
        {
            Title = request.Title,
            Type = request.Type,
            Location = request.Location,
            SalaryRange = request.Salary,
            Experience = request.Experience ?? string.Empty,
            Description = request.Description,
            PostedBy = userId,
            CompanyId = finalCompanyId,
            ConsultantId = consultantId,
            EmployerId = employerId,
            Status = JobStatus.Open,
            CreatedAt = DateTime.UtcNow,
            Skills = request.Skills ?? string.Empty
        };

        await _jobRepository.AddAsync(job);

        return await MapToDto(job);
    }

    public async Task<IEnumerable<JobDto>> GetAllJobsAsync(int? userId = null)
    {
        var jobs = await _jobRepository.GetAllAsync();
        var dtos = new List<JobDto>();
        foreach (var job in jobs)
        {
            var dto = await MapToDto(job);
            if (userId.HasValue)
            {
                var application = (await _applicationRepository.FindAsync(a => a.JobId == job.Id && a.ApplicantId == userId.Value)).FirstOrDefault();
                if (application != null)
                {
                    dto.ApplicationStatus = application.Status.ToString();
                }
            }
            dtos.Add(dto);
        }
        return dtos;
    }

    public async Task<JobDto?> GetJobByIdAsync(int id)
    {
        var job = await _jobRepository.GetByIdAsync(id);
        if (job == null) return null;
        return await MapToDto(job);
    }

    public async Task<IEnumerable<JobDto>> GetJobsByCompanyAsync(int companyId)
    {
        var jobs = await _jobRepository.FindAsync(j => j.CompanyId == companyId);
        var dtos = new List<JobDto>();
        foreach (var job in jobs)
        {
            dtos.Add(await MapToDto(job));
        }
        return dtos;
    }

    public async Task<IEnumerable<JobDto>> GetJobsByConsultantAsync(int consultantId)
    {
        var jobs = await _jobRepository.FindAsync(j => j.ConsultantId == consultantId);
        var dtos = new List<JobDto>();
        foreach (var job in jobs)
        {
            dtos.Add(await MapToDto(job));
        }
        return dtos;
    }

    public async Task<IEnumerable<JobDto>> GetRecommendedJobsAsync(int userId)
    {
        Console.WriteLine($"[JobService] Getting recommended jobs for UserId: {userId}");
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) 
        {
            Console.WriteLine("[JobService] User not found");
            return new List<JobDto>();
        }

        Console.WriteLine($"[JobService] User Skills: '{user.Skills}'");

        if (string.IsNullOrEmpty(user.Skills))
        {
            Console.WriteLine("[JobService] User has no skills, returning recent jobs");
            // If no user or no skills, return recent jobs
            var allJobs = await _jobRepository.GetAllAsync();
            return (await Task.WhenAll(allJobs.OrderByDescending(j => j.CreatedAt).Take(5).Select(MapToDto))).ToList();
        }

        var userSkills = user.Skills.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim().ToLower()).ToList();
        Console.WriteLine($"[JobService] Parsed User Skills: {string.Join(", ", userSkills)}");
        
        var jobs = await _jobRepository.GetAllAsync();
        Console.WriteLine($"[JobService] Total Jobs found: {jobs.Count()}");
        
        var recommendedJobs = jobs
            .Where(j => j.Status == JobStatus.Open)
            .Select(j => new 
            { 
                Job = j, 
                MatchCount = j.Skills.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                    .Count(s => userSkills.Contains(s.Trim().ToLower())) 
            })
            .OrderByDescending(x => x.MatchCount)
            .ThenByDescending(x => x.Job.CreatedAt)
            .Take(5)
            .Select(x => x.Job);

        Console.WriteLine($"[JobService] Recommended Jobs count: {recommendedJobs.Count()}");

        var dtos = new List<JobDto>();
        foreach (var job in recommendedJobs)
        {
            var dto = await MapToDto(job);
            // Check for perfect match (at least 2 matching skills)
            var jobSkills = job.Skills.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim().ToLower());
            var matchCount = jobSkills.Count(s => userSkills.Contains(s));
            dto.IsPerfectMatch = matchCount >= 2;

            // Check application status
            var application = (await _applicationRepository.FindAsync(a => a.JobId == job.Id && a.ApplicantId == userId)).FirstOrDefault();
            if (application != null)
            {
                dto.ApplicationStatus = application.Status.ToString();
            }

            dtos.Add(dto);
        }
        return dtos;
    }

    private async Task<JobDto> MapToDto(Job job)
    {
        string companyName = "Unknown";
        if (job.CompanyId.HasValue)
        {
            var company = await _companyRepository.GetByIdAsync(job.CompanyId.Value);
            if (company != null) companyName = company.Name;
        }

        string employerName = string.Empty;
        if (job.EmployerId.HasValue)
        {
            var employer = await _userRepository.GetByIdAsync(job.EmployerId.Value);
            if (employer != null) employerName = employer.Name;
        }

        return new JobDto
        {
            Id = job.Id,
            Title = job.Title,
            CompanyName = companyName,
            CompanyId = job.CompanyId,
            Type = job.Type,
            Location = job.Location,
            Salary = job.SalaryRange,
            Status = job.Status.ToString(),
            Skills = (job.Skills ?? string.Empty).Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList(),
            Description = job.Description,
            PostedBy = job.PostedBy,
            PostedByName = (await _userRepository.GetByIdAsync(job.PostedBy))?.Name ?? "Unknown",
            Experience = job.Experience,
            CreatedAt = job.CreatedAt,
            ConsultantId = job.ConsultantId,
            EmployerId = job.EmployerId,
            EmployerName = employerName
        };
    }

    public async Task<bool> CloseJobAsync(int jobId, int userId)
    {
        var job = await _jobRepository.GetByIdAsync(jobId);
        if (job == null) return false;

        // Check if user is the poster
        if (job.PostedBy != userId)
        {
            // Ideally check if user is admin too, but for now stick to poster
            return false; 
        }

        job.Status = JobStatus.Closed;
        await _jobRepository.UpdateAsync(job);
        return true;
    }
}
