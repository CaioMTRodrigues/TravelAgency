using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Garante que apenas Admins podem acessar
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("reservations")]
        public async Task<IActionResult> GetReservationsReport(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate,
            [FromQuery] string format = "csv")
        {
            if (startDate > endDate)
            {
                return BadRequest("A data de início não pode ser maior que a data de fim.");
            }

            var reservationsData = await _reportService.GetFilteredReservationsAsync(startDate, endDate);

            if (!reservationsData.Any())
            {
                return NotFound("Nenhuma reserva encontrada para o período selecionado.");
            }

            var fileName = $"relatorio_reservas_{DateTime.Now:yyyy-MM-dd-HH-mm}.{format}";

            if (format.Equals("pdf", StringComparison.OrdinalIgnoreCase))
            {
                var fileBytes = _reportService.GenerateReservationsPdf(reservationsData);
                return File(fileBytes, "application/pdf", fileName);
            }
            else // O padrão é CSV
            {
                var fileBytes = _reportService.GenerateReservationsCsv(reservationsData);
                return File(fileBytes, "text/csv", fileName);
            }
        }
    }
}