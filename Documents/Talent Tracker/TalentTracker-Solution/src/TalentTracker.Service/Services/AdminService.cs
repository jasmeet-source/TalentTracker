using TalentTracker.Core.DTOs;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Enums;
using TalentTracker.Core.Interfaces;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class AdminService : IAdminService
{
    private readonly IRepository<Company> _companyRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Job> _jobRepository;
    private readonly IRepository<Application> _applicationRepository;

    public AdminService(IRepository<Company> companyRepository, IRepository<User> userRepository, IRepository<Job> jobRepository, IRepository<Application> applicationRepository)
    {
        _companyRepository = companyRepository;
        _userRepository = userRepository;
        _jobRepository = jobRepository;
        _applicationRepository = applicationRepository;
    }

    public async Task BlockCompanyAsync(int companyId)
    {
        var company = await _companyRepository.GetByIdAsync(companyId);
        if (company != null)
        {
            company.Status = EntityStatus.Blocked;
            await _companyRepository.UpdateAsync(company);
        }
    }

    public async Task UnblockCompanyAsync(int companyId)
    {
        var company = await _companyRepository.GetByIdAsync(companyId);
        if (company != null)
        {
            company.Status = EntityStatus.Active;
            await _companyRepository.UpdateAsync(company);
        }
    }

    public async Task DeleteCompanyAsync(int companyId)
    {
        var company = await _companyRepository.GetByIdAsync(companyId);
        if (company != null)
        {
            await _companyRepository.DeleteAsync(company);
        }
    }

    public async Task BlockUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.Status = EntityStatus.Blocked;
            await _userRepository.UpdateAsync(user);
        }
    }

    public async Task UnblockUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.Status = EntityStatus.Active;
            await _userRepository.UpdateAsync(user);
        }
    }

    public async Task DeleteUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            await _userRepository.DeleteAsync(user);
        }
    }

    public async Task<IEnumerable<CompanyDto>> GetAllCompaniesAsync()
    {
        var companies = await _companyRepository.GetAllAsync();
        return companies.Select(c => new CompanyDto
        {
            Id = c.Id,
            Name = c.Name,
            Type = c.Type,
            Status = c.Status,
            Location = c.Location,
            Email = c.Users.FirstOrDefault()?.Email // Assuming first user is contact
        });
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role,
            Status = u.Status,
            CompanyName = u.Company?.Name
        });
    }

    public async Task<PlatformStatsDto> GetPlatformStatsAsync()
    {
        var users = await _userRepository.GetAllAsync();
        var companies = await _companyRepository.GetAllAsync();
        var jobs = await _jobRepository.GetAllAsync();
        var applications = await _applicationRepository.GetAllAsync();

        return new PlatformStatsDto
        {
            TotalUsers = users.Count(),
            RegisteredCompanies = companies.Count(),
            BlockedEntities = users.Count(u => u.Status == EntityStatus.Blocked) + companies.Count(c => c.Status == EntityStatus.Blocked),
            ActiveJobs = jobs.Count(j => j.Status == JobStatus.Open),
            TotalApplications = applications.Count()
        };
    }
}
