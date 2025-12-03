using Microsoft.EntityFrameworkCore;
using TalentTracker.Core.Entities;

namespace TalentTracker.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<Complaint> Complaints { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<ConsultantEmployer> ConsultantEmployers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Relationships
        modelBuilder.Entity<User>()
            .HasOne(u => u.Company)
            .WithMany(c => c.Users)
            .HasForeignKey(u => u.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Job Relationships
        modelBuilder.Entity<Job>()
            .HasOne(j => j.Company)
            .WithMany(c => c.Jobs)
            .HasForeignKey(j => j.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Poster)
            .WithMany(u => u.PostedJobs)
            .HasForeignKey(j => j.PostedBy)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Consultant)
            .WithMany(u => u.ConsultantJobs)
            .HasForeignKey(j => j.ConsultantId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Employer)
            .WithMany(u => u.EmployerJobs)
            .HasForeignKey(j => j.EmployerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Application Relationships
        modelBuilder.Entity<Application>()
            .HasOne(a => a.Job)
            .WithMany(j => j.Applications)
            .HasForeignKey(a => a.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Application>()
            .HasOne(a => a.Applicant)
            .WithMany(u => u.Applications)
            .HasForeignKey(a => a.ApplicantId)
            .OnDelete(DeleteBehavior.Restrict);

        // Owned Entity for InterviewDetails
        modelBuilder.Entity<Application>()
            .OwnsOne(a => a.Interview);

        // Complaint Relationships
        modelBuilder.Entity<Complaint>()
            .HasOne(c => c.Submitter)
            .WithMany(u => u.Complaints)
            .HasForeignKey(c => c.SubmittedBy)
            .OnDelete(DeleteBehavior.Restrict);

        // Notification Relationships
        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ConsultantEmployer Relationships
        modelBuilder.Entity<ConsultantEmployer>()
            .HasOne(ce => ce.Employer)
            .WithMany()
            .HasForeignKey(ce => ce.EmployerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ConsultantEmployer>()
            .HasOne(ce => ce.Consultant)
            .WithMany()
            .HasForeignKey(ce => ce.ConsultantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
