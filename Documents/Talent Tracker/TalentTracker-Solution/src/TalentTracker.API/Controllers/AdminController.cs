using Microsoft.AspNetCore.Mvc;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("companies")]
    public async Task<IActionResult> GetAllCompanies()
    {
        var companies = await _adminService.GetAllCompaniesAsync();
        return Ok(companies);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPut("companies/{id}/status")]
    public async Task<IActionResult> UpdateCompanyStatus(int id, [FromBody] string status)
    {
        if (status.ToLower() == "blocked")
        {
            await _adminService.BlockCompanyAsync(id);
        }
        else if (status.ToLower() == "active")
        {
            await _adminService.UnblockCompanyAsync(id);
        }
        else
        {
            return BadRequest("Invalid status");
        }
        return Ok();
    }

    [HttpPut("users/{id}/status")]
    public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] string status)
    {
        if (status.ToLower() == "blocked")
        {
            await _adminService.BlockUserAsync(id);
        }
        else if (status.ToLower() == "active")
        {
            await _adminService.UnblockUserAsync(id);
        }
        else
        {
            return BadRequest("Invalid status");
        }
        return Ok();
    }

    [HttpDelete("companies/{id}")]
    public async Task<IActionResult> DeleteCompany(int id)
    {
        await _adminService.DeleteCompanyAsync(id);
        return Ok();
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _adminService.DeleteUserAsync(id);
        return Ok();
    }

    [HttpGet("reports/stats")]
    public async Task<IActionResult> GetPlatformStats()
    {
        var stats = await _adminService.GetPlatformStatsAsync();
        return Ok(stats);
    }
}
