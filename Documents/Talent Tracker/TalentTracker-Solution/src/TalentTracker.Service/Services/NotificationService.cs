using Microsoft.EntityFrameworkCore;
using TalentTracker.Core.Entities;
using TalentTracker.Infrastructure.Data;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.Service.Services;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateNotificationAsync(int userId, string message)
    {
        var notification = new Notification
        {
            UserId = userId,
            Text = message,
            Time = DateTime.UtcNow,
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Notification>> GetNotificationsAsync(int userId)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.Time)
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(int id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification != null)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }
}
