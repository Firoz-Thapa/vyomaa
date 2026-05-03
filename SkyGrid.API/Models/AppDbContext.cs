using Microsoft.EntityFrameworkCore;
using SkyGrid.API.Models;

namespace SkyGrid.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Satellite> Satellites => Set<Satellite>();
    public DbSet<Pass> Passes => Set<Pass>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Satellite
        modelBuilder.Entity<Satellite>()
            .HasIndex(s => s.NoradId)
            .IsUnique();

        // Pass relationships
        modelBuilder.Entity<Pass>()
            .HasOne(p => p.Satellite)
            .WithMany(s => s.Passes)
            .HasForeignKey(p => p.SatelliteId);

        modelBuilder.Entity<Pass>()
            .HasOne(p => p.Location)
            .WithMany(l => l.Passes)
            .HasForeignKey(p => p.LocationId);

        modelBuilder.Entity<Location>()
            .HasOne(l => l.User)
            .WithMany(u => u.Locations)
            .HasForeignKey(l => l.UserId);

        // Unique email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}