using Microsoft.AspNetCore.Mvc;
using TalentTracker.Core.DTOs;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllJobs([FromQuery] int? userId)
    {
        var jobs = await _jobService.GetAllJobsAsync(userId);
        return Ok(jobs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJobById(int id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        if (job == null) return NotFound();
        return Ok(job);
    }

    [HttpPost]
    public async Task<IActionResult> PostJob([FromBody] CreateJobRequest request, [FromQuery] int userId, [FromQuery] int? companyId)
    {
        // In a real app, userId would come from the JWT token claims
        var job = await _jobService.PostJobAsync(request, userId, companyId);
        return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
    }

    [HttpGet("company/{companyId}")]
    public async Task<IActionResult> GetJobsByCompany(int companyId)
    {
        var jobs = await _jobService.GetJobsByCompanyAsync(companyId);
        return Ok(jobs);
    }

    [HttpGet("consultant/{consultantId}")]
    public async Task<IActionResult> GetJobsByConsultant(int consultantId)
    {
        var jobs = await _jobService.GetJobsByConsultantAsync(consultantId);
        return Ok(jobs);
    }

    [HttpGet("recommended/{userId}")]
    public async Task<IActionResult> GetRecommendedJobs(int userId)
    {
        Console.WriteLine($"[JobsController] GetRecommendedJobs called for UserId: {userId}");
        var jobs = await _jobService.GetRecommendedJobsAsync(userId);
        return Ok(jobs);
    }

    [HttpPost("{id}/close")]
    public async Task<IActionResult> CloseJob(int id, [FromQuery] int userId)
    {
        var result = await _jobService.CloseJobAsync(id, userId);
        if (!result) return BadRequest("Unable to close job. Either job not found or unauthorized.");
        return Ok(new { message = "Job closed successfully" });
    }
}
