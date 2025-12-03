using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentTracker.Service.Interfaces;

namespace TalentTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats([FromQuery] int? userId)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"[DashboardController] GetStats called. UserIdClaim: {userIdClaim}, QueryUserId: {userId}");
            
            int finalUserId = userId ?? int.Parse(userIdClaim ?? "0");
            
            if (finalUserId == 0)
            {
                return BadRequest(new { message = "User ID not provided" });
            }

            var stats = await _dashboardService.GetStatsAsync(finalUserId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
