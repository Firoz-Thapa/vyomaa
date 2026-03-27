using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyGrid.API.Data;
using SkyGrid.API.Models;

namespace SkyGrid.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SatellitesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<SatellitesController> _logger;

    public SatellitesController(AppDbContext db, ILogger<SatellitesController> logger)
    {
        _db = db;
        _logger = logger;
    }

    // GET api/satellites
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var satellites = await _db.Satellites
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .ToListAsync();

        return Ok(satellites);
    }

    // GET api/satellites/25544
    [HttpGet("{noradId}")]
    public async Task<IActionResult> GetByNoradId(int noradId)
    {
        var satellite = await _db.Satellites
            .FirstOrDefaultAsync(s => s.NoradId == noradId);

        if (satellite is null)
            return NotFound($"Satellite with NORAD ID {noradId} not found.");

        return Ok(satellite);
    }

    // POST api/satellites
    [HttpPost]
    public async Task<IActionResult> Create(Satellite satellite)
    {
        _db.Satellites.Add(satellite);
        await _db.SaveChangesAsync();
        _logger.LogInformation("Created satellite: {Name}", satellite.Name);
        return CreatedAtAction(nameof(GetByNoradId), new { noradId = satellite.NoradId }, satellite);
    }
}