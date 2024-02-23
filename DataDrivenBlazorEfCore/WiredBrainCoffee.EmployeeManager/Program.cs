using Microsoft.EntityFrameworkCore;
using WiredBrainCoffee.EmployeeManager.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddDbContext<EmployeeManagerDbContext>(
    opt => opt.UseSqlite(builder.Configuration.GetConnectionString("EmployeeManagerDb"))
);

var app = builder.Build();

// Don't do this in production! Just useful for development...
await EnsureDatabaseIsMigrated(app.Services);

async Task EnsureDatabaseIsMigrated(IServiceProvider services)
{
    using var scope = services.CreateScope();
    await using var context = scope.ServiceProvider.GetService<EmployeeManagerDbContext>();
    if (context != null)
    {
        await context.Database.MigrateAsync();
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
