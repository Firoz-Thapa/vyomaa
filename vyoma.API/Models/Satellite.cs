using Microsoft.AspNetCore.Identity;

namespace SkyGrid.API.Models;

public class Satellite
{
    public int Id { get; set;}
    public string Name { get; set; } = string.Empty;
    public int NoradId { get; set; }
    public string TleLine1 { get; set; } = string.Empty;
    public string TleLine2 { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    public ICollection<Pass> Passes { get; set; } = new List<Pass>();
}

