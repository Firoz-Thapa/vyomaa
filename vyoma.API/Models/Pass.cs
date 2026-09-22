namespace SkyGrid.API.Models;

public class Pass
{
    public int Id { get; set; }
    public int SatelliteId { get; set; }
    public int LocationId { get; set; }
    public DateTime AosTime { get; set; }
    public DateTime LosTime { get; set; }
    public double MaxElevation { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Satellite Satellite { get; set; } = null!;
    public Location Location { get; set; } = null!;
}