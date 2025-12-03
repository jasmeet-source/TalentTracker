using TalentTracker.Core.DTOs;
using TalentTracker.Core.Entities;

namespace TalentTracker.Service.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<bool> ChangePasswordAsync(ChangePasswordRequest request);
}

public interface IJobService
{
    Task<JobDto> PostJobAsync(CreateJobRequest request, int userId, int? companyId);
    Task<IEnumerable<JobDto>> GetAllJobsAsync(int? userId = null);
    Task<JobDto?> GetJobByIdAsync(int id);
    Task<IEnumerable<JobDto>> GetJobsByCompanyAsync(int companyId);
    Task<IEnumerable<JobDto>> GetJobsByConsultantAsync(int consultantId);
    Task<IEnumerable<JobDto>> GetRecommendedJobsAsync(int userId);
    Task<bool> CloseJobAsync(int jobId, int userId);
}

public interface IAdminService
{
    Task BlockCompanyAsync(int companyId);
    Task UnblockCompanyAsync(int companyId);
    Task DeleteCompanyAsync(int companyId);
    Task BlockUserAsync(int userId);
    Task UnblockUserAsync(int userId);
    Task DeleteUserAsync(int userId);
    Task<IEnumerable<CompanyDto>> GetAllCompaniesAsync();
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<PlatformStatsDto> GetPlatformStatsAsync();
}

public interface IApplicationService
{
    Task<ApplicationDto> ApplyAsync(int jobId, int applicantId);
    Task<IEnumerable<ApplicationDto>> GetApplicationsByJobAsync(int jobId);
    Task<IEnumerable<ApplicationDto>> GetApplicationsByUserAsync(int userId);
    Task UpdateStatusAsync(int applicationId, string status, InterviewDto? interview = null);
}

public interface IUserService
{
    Task<User> GetUserByIdAsync(int id);
    Task UpdateProfileAsync(UpdateProfileRequest request);
    Task<string> UploadResumeAsync(int userId, Stream fileStream, string fileName);
    Task<int> GetProfileCompletenessAsync(int userId);
    Task<IEnumerable<User>> GetEmployersAsync();
}

public interface IComplaintService
{
    Task<IEnumerable<Complaint>> GetAllComplaintsAsync();
    Task<Complaint> CreateComplaintAsync(CreateComplaintRequest request);
    Task UpdateStatusAsync(int id, string status);
}

public interface INotificationService
{
    Task CreateNotificationAsync(int userId, string message);
    Task<IEnumerable<Notification>> GetNotificationsAsync(int userId);
    Task MarkAsReadAsync(int id);
}

public interface IConsultantService
{
    Task<IEnumerable<User>> SearchConsultantsAsync(string query);
    Task RequestConsultantAccessAsync(int employerId, int consultantId, string? note = null);
    Task GrantAccessAsync(int employerId, int consultantId, string? note = null);
    Task ApproveConsultantAsync(int requestId);
    Task RejectConsultantAsync(int requestId);
    Task RemoveConsultantAsync(int employerId, int consultantId);
    Task<IEnumerable<ConsultantEmployer>> GetEmployerConsultantsAsync(int employerId);
    Task<IEnumerable<ConsultantEmployer>> GetConsultantClientsAsync(int consultantId);
}

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(int userId);
}
