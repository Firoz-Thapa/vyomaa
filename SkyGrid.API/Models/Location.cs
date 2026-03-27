namespace SkyGrid.API.Models;

public class Location
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // e.g. "Lappeenranta"
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double AltitudeKm { get; set; } = 0.0;
    public int? UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public ICollection<Pass> Passes { get; set; } = new List<Pass>();
}