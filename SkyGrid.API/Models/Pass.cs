namespace SkyGrid.API.Models;

public class Pass
{
    public int Id { get; set; }
    public int SatelliteId { get; set; }
    public int LocationId { get; set; }
    public DateTime AosTime { get; set; }    // Acquisition of Signal
    public DateTime LosTime { get; set; }    // Loss of Signal
    public double MaxElevation { get; set; } // degrees (90 = directly overhead)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Satellite Satellite { get; set; } = null!;
    public Location Location { get; set; } = null!;
}