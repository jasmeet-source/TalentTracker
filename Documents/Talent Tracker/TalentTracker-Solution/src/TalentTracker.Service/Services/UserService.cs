using TalentTracker.Core.DTOs;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Interfaces;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class UserService : IUserService
{
    private readonly IRepository<User> _userRepository;

    public UserService(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> GetUserByIdAsync(int id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task UpdateProfileAsync(UpdateProfileRequest request)
    {
        var user = await _userRepository.GetByIdAsync(request.Id);
        if (user == null) throw new Exception("User not found");

        user.Address = request.Address;
        user.DesiredJob = request.DesiredJob;
        user.ExperienceYears = request.ExperienceYears;
        user.Summary = request.Summary;
        if (request.Skills != null && request.Skills.Any())
        {
            user.Skills = string.Join(", ", request.Skills);
        }
        
        await _userRepository.UpdateAsync(user);
    }

    public async Task<string> UploadResumeAsync(int userId, Stream fileStream, string fileName)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "resumes");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = $"{userId}_{Guid.NewGuid()}_{fileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        user.ResumeUrl = uniqueFileName;
        await _userRepository.UpdateAsync(user);

        return uniqueFileName;
    }
    public async Task<int> GetProfileCompletenessAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");

        int completed = 0;
        int total = 6;

        if (!string.IsNullOrEmpty(user.Skills)) completed++;
        if (!string.IsNullOrEmpty(user.Address)) completed++;
        if (!string.IsNullOrEmpty(user.ResumeUrl)) completed++;
        if (!string.IsNullOrEmpty(user.DesiredJob)) completed++;
        if (user.ExperienceYears.HasValue) completed++;
        if (!string.IsNullOrEmpty(user.Summary)) completed++;

        return (int)((double)completed / total * 100);
    }

    public async Task<IEnumerable<User>> GetEmployersAsync()
    {
        return await _userRepository.FindAsync(u => u.Role == Core.Enums.UserRole.Employer);
    }
}
