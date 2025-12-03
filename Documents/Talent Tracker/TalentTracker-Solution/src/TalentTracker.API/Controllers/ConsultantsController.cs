using Microsoft.AspNetCore.Mvc;
using TalentTracker.Core.Entities;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConsultantsController : ControllerBase
{
    private readonly IConsultantService _consultantService;

    public ConsultantsController(IConsultantService consultantService)
    {
        _consultantService = consultantService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchConsultants([FromQuery] string query)
    {
        var consultants = await _consultantService.SearchConsultantsAsync(query);
        return Ok(consultants);
    }

    [HttpPost("request")]
    public async Task<IActionResult> RequestAccess([FromQuery] int employerId, [FromQuery] int consultantId, [FromQuery] string? note = null)
    {
        await _consultantService.RequestConsultantAccessAsync(employerId, consultantId, note);
        return Ok(new { message = "Request sent successfully" });
    }

    [HttpPost("grant")]
    public async Task<IActionResult> GrantAccess([FromQuery] int employerId, [FromQuery] int consultantId, [FromQuery] string? note = null)
    {
        await _consultantService.GrantAccessAsync(employerId, consultantId, note);
        return Ok(new { message = "Access granted successfully" });
    }

    [HttpPost("approve/{requestId}")]
    public async Task<IActionResult> ApproveRequest(int requestId)
    {
        await _consultantService.ApproveConsultantAsync(requestId);
        return Ok(new { message = "Request approved" });
    }

    [HttpPost("reject/{requestId}")]
    public async Task<IActionResult> RejectRequest(int requestId)
    {
        await _consultantService.RejectConsultantAsync(requestId);
        return Ok(new { message = "Request rejected" });
    }

    [HttpDelete("remove")]
    public async Task<IActionResult> RemoveConsultant([FromQuery] int employerId, [FromQuery] int consultantId)
    {
        await _consultantService.RemoveConsultantAsync(employerId, consultantId);
        return Ok(new { message = "Consultant removed" });
    }

    [HttpGet("employer/{employerId}")]
    public async Task<IActionResult> GetEmployerConsultants(int employerId)
    {
        var consultants = await _consultantService.GetEmployerConsultantsAsync(employerId);
        return Ok(consultants);
    }

    [HttpGet("consultant/{consultantId}")]
    public async Task<IEnumerable<ConsultantEmployer>> GetConsultantClients(int consultantId)
    {
        return await _consultantService.GetConsultantClientsAsync(consultantId);
    }
}
