namespace TalentTracker.Core.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }

    public string Text { get; set; } = string.Empty;
    public DateTime Time { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
}
