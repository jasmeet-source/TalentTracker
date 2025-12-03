using TalentTracker.Core.DTOs;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Enums;
using TalentTracker.Core.Interfaces;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class DashboardService : IDashboardService
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Job> _jobRepository;
    private readonly IRepository<Application> _applicationRepository;
    private readonly IRepository<Company> _companyRepository;

    public DashboardService(
        IRepository<User> userRepository,
        IRepository<Job> jobRepository,
        IRepository<Application> applicationRepository,
        IRepository<Company> companyRepository)
    {
        _userRepository = userRepository;
        _jobRepository = jobRepository;
        _applicationRepository = applicationRepository;
        _companyRepository = companyRepository;
    }

    public async Task<DashboardStatsDto> GetStatsAsync(int userId)
    {
        Console.WriteLine($"[DashboardService] GetStatsAsync called for UserId: {userId}");
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) 
        {
            Console.WriteLine("[DashboardService] User not found in repository");
            throw new KeyNotFoundException("User not found");
        }

        Console.WriteLine($"[DashboardService] User found: {user.Email}, Role: {user.Role}");

        var stats = new DashboardStatsDto();

        if (user.Role == UserRole.Seeker)
        {
            try
            {
                Console.WriteLine($"[DashboardService] Getting stats for Seeker: {userId}");
                var applications = await _applicationRepository.FindAsync(a => a.ApplicantId == userId);
                Console.WriteLine($"[DashboardService] Applications found: {applications.Count()}");
                stats.JobsApplied = applications.Count();
                
                // Check if Interview property access is causing issues
                try 
                {
                    stats.Interviews = applications.Count(a => a.Interview != null);
                }
                catch (Exception ex)
                {
                     Console.WriteLine($"[DashboardService] Error counting interviews: {ex.Message}");
                     stats.Interviews = 0;
                }

                stats.Shortlisted = applications.Count(a => a.Status == ApplicationStatus.Shortlisted);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DashboardService] Error in Seeker stats: {ex.Message}");
                Console.WriteLine($"[DashboardService] StackTrace: {ex.StackTrace}");
                
                // Log to file
                try {
                    File.AppendAllText("error_log.txt", $"[{DateTime.Now}] Error: {ex.Message}\nStack: {ex.StackTrace}\n\n");
                } catch {}
                
                throw;
            }
        }
        else if (user.Role == UserRole.Employer)
        {
            if (user.CompanyId.HasValue)
            {
                var jobs = await _jobRepository.FindAsync(j => j.CompanyId == user.CompanyId.Value);
                
                stats.ActivePosts = jobs.Count(j => j.Status == JobStatus.Open);
                stats.TotalCompanyJobs = jobs.Count();
                
                var companyJobIds = jobs.Select(j => j.Id).ToList();
                
                var applications = await _applicationRepository.FindAsync(a => companyJobIds.Contains(a.JobId) && a.Status == ApplicationStatus.Pending);
                
                stats.PendingReview = applications.Count();
            }
        }
        else if (user.Role == UserRole.Consultant)
        {
            var jobs = await _jobRepository.FindAsync(j => j.ConsultantId == userId);
            
            stats.ActivePosts = jobs.Count(j => j.Status == JobStatus.Open);
            stats.TotalCompanyJobs = jobs.Count(); 
             
            var consultantJobIds = jobs.Select(j => j.Id).ToList();
            var applications = await _applicationRepository.FindAsync(a => consultantJobIds.Contains(a.JobId) && a.Status == ApplicationStatus.Pending);
            stats.PendingReview = applications.Count();
        }
        else if (user.Role == UserRole.Admin)
        {
            var users = await _userRepository.GetAllAsync();
            var companies = await _companyRepository.GetAllAsync();

            stats.TotalUsers = users.Count();
            stats.RegisteredCompanies = companies.Count();
            
            var blockedUsers = users.Count(u => u.Status == EntityStatus.Blocked);
            var blockedCompanies = companies.Count(c => c.Status == EntityStatus.Blocked);
            stats.BlockedEntities = blockedUsers + blockedCompanies;
        }

        return stats;
    }
}
