using TalentTracker.Core.Entities;
using TalentTracker.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace TalentTracker.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Seed Companies first
        var techFlowCompany = await context.Companies.FirstOrDefaultAsync(c => c.Name == "TechFlow");
        if (techFlowCompany == null)
        {
            techFlowCompany = new Company
            {
                Name = "TechFlow",
                Type = CompanyType.Employer,
                Location = "Bangalore",
                Status = EntityStatus.Active
            };
            await context.Companies.AddAsync(techFlowCompany);
            await context.SaveChangesAsync();
        }

        // Check if Admin exists
        var admin = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@talenttracker.com");
        if (admin == null)
        {
            admin = new User
            {
                Name = "Admin User",
                Username = "admin",
                Email = "admin@talenttracker.com",
                Role = UserRole.Admin,
                Status = EntityStatus.Active
            };
            await context.Users.AddAsync(admin);
        }
        
        // Check if Consultant exists
        var consultant = await context.Users.FirstOrDefaultAsync(u => u.Email == "consultant@talenttracker.com");
        if (consultant == null)
        {
            consultant = new User
            {
                Name = "Consultant User",
                Username = "consultant",
                Email = "consultant@talenttracker.com",
                Role = UserRole.Consultant,
                Status = EntityStatus.Active
            };
            await context.Users.AddAsync(consultant);
        }

        // Check if Rajesh exists
        var rajesh = await context.Users.FirstOrDefaultAsync(u => u.Email == "rajesh@consultant.com");
        if (rajesh == null)
        {
            rajesh = new User
            {
                Name = "Rajesh Kumar",
                Username = "rajesh",
                Email = "rajesh@consultant.com",
                Role = UserRole.Consultant,
                Status = EntityStatus.Active
            };
            await context.Users.AddAsync(rajesh);
        }

        // Check if Job Seeker exists
        var jobSeeker = await context.Users.FirstOrDefaultAsync(u => u.Email == "aryan@seeker.com");
        if (jobSeeker == null)
        {
            jobSeeker = new User
            {
                Name = "Aryan Kumar",
                Username = "aryan",
                Email = "aryan@seeker.com",
                Role = UserRole.Seeker,
                Status = EntityStatus.Active,
                Skills = "React, Node.js, JavaScript, C#",
                DesiredJob = "Full Stack Developer"
            };
            await context.Users.AddAsync(jobSeeker);
        }

        // Check if Employer exists
        var employer = await context.Users.FirstOrDefaultAsync(u => u.Email == "priya@techflow.com");
        if (employer == null)
        {
            employer = new User
            {
                Name = "Priya Sharma",
                Username = "priya",
                Email = "priya@techflow.com",
                Role = UserRole.Employer,
                CompanyId = techFlowCompany.Id,
                Status = EntityStatus.Active
            };
            await context.Users.AddAsync(employer);
        }

        await context.SaveChangesAsync();

        // Seed Jobs
        var job = await context.Jobs.FirstOrDefaultAsync(j => j.Title == "Full Stack Developer");
        if (job == null && employer != null && techFlowCompany != null)
        {
            job = new Job
            {
                Title = "Full Stack Developer",
                Description = "We are looking for a skilled Full Stack Developer.",
                CompanyId = techFlowCompany.Id,
                PostedBy = employer.Id,
                Location = "Bangalore",
                SalaryRange = "12-18 LPA",
                Type = "Full-Time",
                Status = JobStatus.Open,
                CreatedAt = DateTime.UtcNow,
                Skills = "React, Node.js, C#",
                Experience = "Mid-Senior"
            };
            await context.Jobs.AddAsync(job);
            await context.SaveChangesAsync();
        }

        // Seed Applications
        if (job != null && jobSeeker != null)
        {
            var application = await context.Applications.FirstOrDefaultAsync(a => a.JobId == job.Id && a.ApplicantId == jobSeeker.Id);
            if (application == null)
            {
                application = new Application
                {
                    JobId = job.Id,
                    ApplicantId = jobSeeker.Id,
                    Status = ApplicationStatus.Pending,
                    DateApplied = DateTime.UtcNow
                };
                await context.Applications.AddAsync(application);
                await context.SaveChangesAsync();
            }
        }

        // RESET ALL PASSWORDS TO pass123
        var allUsers = await context.Users.ToListAsync();
        var commonPasswordHash = BCrypt.Net.BCrypt.HashPassword("pass123");

        foreach (var user in allUsers)
        {
            // Always reset for now to ensure access
            user.PasswordHash = commonPasswordHash;
            user.Status = EntityStatus.Active; // Force unblock everyone
            Console.WriteLine($"Resetting password and status for {user.Email}");
        }
        
        await context.SaveChangesAsync();
        Console.WriteLine($"Reset passwords for {allUsers.Count} users to 'pass123'");
        Console.WriteLine("Seeding completed.");
    }
}
