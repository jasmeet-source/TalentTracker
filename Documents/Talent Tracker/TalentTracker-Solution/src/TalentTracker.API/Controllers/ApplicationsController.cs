using Microsoft.AspNetCore.Mvc;
using TalentTracker.Core.DTOs;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpPost("apply")]
    public async Task<IActionResult> Apply([FromQuery] int jobId, [FromQuery] int applicantId)
    {
        try
        {
            var app = await _applicationService.ApplyAsync(jobId, applicantId);
            return Ok(app);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("job/{jobId}")]
    public async Task<IActionResult> GetByJob(int jobId)
    {
        var apps = await _applicationService.GetApplicationsByJobAsync(jobId);
        return Ok(apps);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(int userId)
    {
        var apps = await _applicationService.GetApplicationsByUserAsync(userId);
        return Ok(apps);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusRequest request)
    {
        await _applicationService.UpdateStatusAsync(id, request.Status, request.Interview);
        return Ok();
    }
}
