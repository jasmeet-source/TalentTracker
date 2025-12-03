using TalentTracker.Core.DTOs;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Interfaces;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class ComplaintService : IComplaintService
{
    private readonly IRepository<Complaint> _complaintRepository;

    public ComplaintService(IRepository<Complaint> complaintRepository)
    {
        _complaintRepository = complaintRepository;
    }

    public async Task<IEnumerable<Complaint>> GetAllComplaintsAsync()
    {
        return await _complaintRepository.GetAllAsync();
    }

    public async Task<Complaint> CreateComplaintAsync(CreateComplaintRequest request)
    {
        var complaint = new Complaint
        {
            SubmittedBy = request.SubmittedBy,
            Type = request.Type,
            Description = request.Description,
            Status = Core.Enums.ComplaintStatus.Pending,
            DateSubmitted = DateTime.UtcNow
        };

        return await _complaintRepository.AddAsync(complaint);
    }

    public async Task UpdateStatusAsync(int id, string status)
    {
        var complaint = await _complaintRepository.GetByIdAsync(id);
        if (complaint == null) throw new Exception("Complaint not found");

        if (Enum.TryParse<Core.Enums.ComplaintStatus>(status, true, out var statusEnum))
        {
            complaint.Status = statusEnum;
            await _complaintRepository.UpdateAsync(complaint);
        }
    }
}
