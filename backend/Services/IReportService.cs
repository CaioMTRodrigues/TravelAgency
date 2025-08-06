using WebApplication1.DTOs;

namespace WebApplication1.Services
{
    public interface IReportService
    {
        Task<IEnumerable<ReservationReportDto>> GetFilteredReservationsAsync(DateTime startDate, DateTime endDate);
        byte[] GenerateReservationsCsv(IEnumerable<ReservationReportDto> reservations);
        byte[] GenerateReservationsPdf(IEnumerable<ReservationReportDto> reservations);
    }
}