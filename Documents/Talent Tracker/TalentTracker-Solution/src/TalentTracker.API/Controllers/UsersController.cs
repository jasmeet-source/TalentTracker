using Microsoft.AspNetCore.Mvc;
using TalentTracker.Core.DTOs;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
    {
        if (id != request.Id) return BadRequest();
        await _userService.UpdateProfileAsync(request);
        return Ok();
    }

    [HttpPost("{id}/resume")]
    public async Task<IActionResult> UploadResume(int id, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No file uploaded.");
        
        var fileName = await _userService.UploadResumeAsync(id, file.OpenReadStream(), file.FileName);
        return Ok(new { fileName });
    }

    [HttpGet("{id}/completeness")]
    public async Task<IActionResult> GetProfileCompleteness(int id)
    {
        var completeness = await _userService.GetProfileCompletenessAsync(id);
        return Ok(new { completeness });
    }

    [HttpGet("employers")]
    public async Task<IActionResult> GetEmployers()
    {
        var employers = await _userService.GetEmployersAsync();
        return Ok(employers);
    }
}
