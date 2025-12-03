using TalentTracker.Core.Enums;

namespace TalentTracker.Core.Entities;

public class Company : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public CompanyType Type { get; set; }
    public EntityStatus Status { get; set; } = EntityStatus.Active;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Job> Jobs { get; set; } = new List<Job>();
}
