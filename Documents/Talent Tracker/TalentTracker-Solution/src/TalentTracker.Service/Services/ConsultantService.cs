using Microsoft.EntityFrameworkCore;
using TalentTracker.Core.Entities;
using TalentTracker.Core.Enums;
using TalentTracker.Infrastructure.Data;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class ConsultantService : IConsultantService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public ConsultantService(AppDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<IEnumerable<User>> SearchConsultantsAsync(string query)
    {
        IQueryable<User> dbQuery = _context.Users
            .Where(u => u.Role == UserRole.Consultant)
            .Include(u => u.Company);

        if (!string.IsNullOrWhiteSpace(query))
        {
            string lowerQuery = query.ToLower();
            dbQuery = dbQuery.Where(u => 
                (u.Name != null && u.Name.ToLower().Contains(lowerQuery)) || 
                (u.Email != null && u.Email.ToLower().Contains(lowerQuery)) || 
                (u.Company != null && u.Company.Name != null && u.Company.Name.ToLower().Contains(lowerQuery)));
        }

        return await dbQuery.ToListAsync();
    }

    public async Task RequestConsultantAccessAsync(int employerId, int consultantId, string? note = null)
    {
        var existing = await _context.ConsultantEmployers
            .FirstOrDefaultAsync(ce => ce.EmployerId == employerId && ce.ConsultantId == consultantId);

        if (existing != null)
        {
            if (existing.Status == ConsultantEmployerStatus.Rejected)
            {
                existing.Status = ConsultantEmployerStatus.Pending;
                existing.DateRequested = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            return;
        }

        var link = new ConsultantEmployer
        {
            EmployerId = employerId,
            ConsultantId = consultantId,
            Status = ConsultantEmployerStatus.Pending,
            DateRequested = DateTime.UtcNow
        };
        
        _context.ConsultantEmployers.Add(link);
        await _context.SaveChangesAsync();

        // Notify Consultant
        string message = $"Employer {employerId} has requested access to your services.";
        if (!string.IsNullOrEmpty(note)) message += $" Note: {note}";
        
        await _notificationService.CreateNotificationAsync(consultantId, message);
    }

    public async Task GrantAccessAsync(int employerId, int consultantId, string? note = null)
    {
         var existing = await _context.ConsultantEmployers
            .FirstOrDefaultAsync(ce => ce.EmployerId == employerId && ce.ConsultantId == consultantId);

        if (existing != null)
        {
            existing.Status = ConsultantEmployerStatus.Approved;
            existing.DateActioned = DateTime.UtcNow;
            if (!string.IsNullOrEmpty(note)) existing.RequestNote = note;
        }
        else
        {
            var link = new ConsultantEmployer
            {
                EmployerId = employerId,
                ConsultantId = consultantId,
                Status = ConsultantEmployerStatus.Approved,
                DateRequested = DateTime.UtcNow,
                DateActioned = DateTime.UtcNow,
                RequestNote = note
            };
            _context.ConsultantEmployers.Add(link);
        }
        await _context.SaveChangesAsync();

        // Notify Consultant
        string message = "You have been granted access to post jobs for an employer.";
        if (!string.IsNullOrEmpty(note)) message += $" Note: {note}";

        await _notificationService.CreateNotificationAsync(consultantId, message);
    }

    public async Task ApproveConsultantAsync(int requestId)
    {
        var request = await _context.ConsultantEmployers.FindAsync(requestId);
        if (request != null)
        {
            request.Status = ConsultantEmployerStatus.Approved;
            request.DateActioned = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Notify Consultant
            await _notificationService.CreateNotificationAsync(request.ConsultantId, "Your request for employer access has been approved.");
        }
    }

    public async Task RejectConsultantAsync(int requestId)
    {
        var request = await _context.ConsultantEmployers.FindAsync(requestId);
        if (request != null)
        {
            request.Status = ConsultantEmployerStatus.Rejected;
            request.DateActioned = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Notify Consultant
            await _notificationService.CreateNotificationAsync(request.ConsultantId, "Your request for employer access has been rejected.");
        }
    }

    public async Task RemoveConsultantAsync(int employerId, int consultantId)
    {
        var link = await _context.ConsultantEmployers
            .FirstOrDefaultAsync(ce => ce.EmployerId == employerId && ce.ConsultantId == consultantId);
        
        if (link != null)
        {
            _context.ConsultantEmployers.Remove(link);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<ConsultantEmployer>> GetEmployerConsultantsAsync(int employerId)
    {
        return await _context.ConsultantEmployers
            .Include(ce => ce.Consultant)
            .ThenInclude(c => c.Company)
            .Where(ce => ce.EmployerId == employerId)
            .ToListAsync();
    }

    public async Task<IEnumerable<ConsultantEmployer>> GetConsultantClientsAsync(int consultantId)
    {
        return await _context.ConsultantEmployers
            .Include(ce => ce.Employer)
            .ThenInclude(e => e.Company)
            .Where(ce => ce.ConsultantId == consultantId)
            .ToListAsync();
    }
}
