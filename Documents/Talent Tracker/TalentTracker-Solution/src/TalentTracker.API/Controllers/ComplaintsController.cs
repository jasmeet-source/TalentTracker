using Microsoft.AspNetCore.Mvc;
using TalentTracker.Core.DTOs;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComplaintsController : ControllerBase
{
    private readonly IComplaintService _complaintService;

    public ComplaintsController(IComplaintService complaintService)
    {
        _complaintService = complaintService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var complaints = await _complaintService.GetAllComplaintsAsync();
        return Ok(complaints);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateComplaintRequest request)
    {
        var complaint = await _complaintService.CreateComplaintAsync(request);
        return CreatedAtAction(nameof(GetAll), new { id = complaint.Id }, complaint);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateComplaintStatusRequest request)
    {
        await _complaintService.UpdateStatusAsync(id, request.Status);
        return Ok();
    }
}
