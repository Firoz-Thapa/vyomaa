using Microsoft.EntityFrameworkCore;
using Serilog;
using SkyGrid.API.Data;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.Host.UseSerilog();

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddOpenApi();

// PostgreSQL + EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS (for React frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// HttpClient (for CelesTrak)
builder.Services.AddHttpClient();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseSerilogRequestLogging();
app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();

app.Run();