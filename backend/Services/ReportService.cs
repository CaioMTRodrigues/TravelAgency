using Microsoft.EntityFrameworkCore;
using System.Globalization;
using CsvHelper;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using QuestPDF.Helpers;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Services;

namespace WebApplication1.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
            QuestPDF.Settings.License = LicenseType.Community; // Licença para uso comunitário
        }

        public async Task<IEnumerable<ReservationReportDto>> GetFilteredReservationsAsync(DateTime startDate, DateTime endDate)
        {
            var adjustedEndDate = endDate.Date.AddDays(1).AddTicks(-1);

            var reservations = await _context.Reservations
                .Include(r => r.Usuario)
                .Include(r => r.Pacote)
                .Include(r => r.Pagamentos)
                .Where(r => r.Data_Reserva >= startDate && r.Data_Reserva <= adjustedEndDate)
                .OrderBy(r => r.Data_Reserva)
                .ToListAsync();

            return reservations.Select(r =>
            {
                var firstPayment = r.Pagamentos.FirstOrDefault();
                return new ReservationReportDto
                {
                    Id_Reserva = r.Id_Reserva,
                    Numero_Reserva = r.Numero_Reserva,
                    Data_Reserva = r.Data_Reserva,
                    // CORREÇÃO 1: Convertendo o enum StatusReserva para string.
                    Status_Reserva = r.Status.ToString(),
                    Nome_Cliente = r.Usuario.Name,
                    Email_Cliente = r.Usuario.Email,
                    Nome_Pacote = r.Pacote.Titulo,
                    Destino_Pacote = r.Pacote.Destino,
                    Valor_Total = r.ValorPacote,
                    // CORREÇÃO 2: Usando operador ternário para verificar a existência do pagamento antes de converter o enum.
                    Status_Pagamento = firstPayment != null ? firstPayment.Status.ToString() : "N/A",
                    Metodo_Pagamento = firstPayment != null ? firstPayment.Tipo.ToString() : "N/A"
                };
            }).ToList();
        }

        // O restante do arquivo (GenerateReservationsCsv e GenerateReservationsPdf) permanece igual.
        public byte[] GenerateReservationsCsv(IEnumerable<ReservationReportDto> reservations)
        {
            using (var memoryStream = new MemoryStream())
            using (var writer = new StreamWriter(memoryStream))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csv.WriteRecords(reservations);
                writer.Flush();
                return memoryStream.ToArray();
            }
        }

        public byte[] GenerateReservationsPdf(IEnumerable<ReservationReportDto> reservations)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(1, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header()
                        .Text("Relatório de Reservas - TravelAgency")
                        .SemiBold().FontSize(16).FontColor("#2d2d2d");

                    page.Content()
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2); // Nº Reserva
                                columns.RelativeColumn(3); // Cliente
                                columns.RelativeColumn(4); // Pacote
                                columns.RelativeColumn(2); // Data
                                columns.RelativeColumn(2); // Valor
                                columns.RelativeColumn(2); // Status
                            });

                            table.Header(header =>
                            {
                                header.Cell().Background("#4682B4").Padding(2).Text("Nº Reserva").FontColor("#fff");
                                header.Cell().Background("#4682B4").Padding(2).Text("Cliente").FontColor("#fff");
                                header.Cell().Background("#4682B4").Padding(2).Text("Pacote").FontColor("#fff");
                                header.Cell().Background("#4682B4").Padding(2).Text("Data").FontColor("#fff");
                                header.Cell().Background("#4682B4").Padding(2).Text("Valor").FontColor("#fff");
                                header.Cell().Background("#4682B4").Padding(2).Text("Status").FontColor("#fff");
                            });

                            foreach (var item in reservations)
                            {
                                table.Cell().BorderBottom(1).BorderColor("#ccc").Padding(2).Text(item.Numero_Reserva);
                                table.Cell().BorderBottom(1).BorderColor("#ccc").Padding(2).Text(item.Nome_Cliente);
                                table.Cell().BorderBottom(1).BorderColor("#ccc").Padding(2).Text(item.Nome_Pacote);
                                table.Cell().BorderBottom(1).BorderColor("#ccc").Padding(2).Text(item.Data_Reserva.ToString("dd/MM/yyyy"));
                                table.Cell().BorderBottom(1).BorderColor("#ccc").Padding(2).Text(item.Valor_Total.ToString("C", new CultureInfo("pt-BR")));
                                table.Cell().BorderBottom(1).BorderColor("#ccc").Padding(2).Text(item.Status_Reserva);
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Página ");
                            x.CurrentPageNumber();
                            x.Span(" de ");
                            x.TotalPages();
                        });
                });
            }).GeneratePdf();
        }
    }
}