using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalPackages = await _context.Packages.CountAsync();

            var pendingReservations = await _context.Reservations
                .CountAsync(r => r.Status == StatusReserva.Pendente);

            // CORREÇÃO FINAL: Usando a propriedade 'Data' da entidade Evaluation.
            var newReviews = await _context.Evaluations
                .CountAsync(e => e.Data > DateTime.UtcNow.AddDays(-7));

            var stats = new
            {
                TotalPackages = totalPackages,
                PendingReservations = pendingReservations,
                NewReviews = newReviews
            };

            return Ok(stats);
        }
    }
}