using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace WebApplication1.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task EnviarEmailConfirmacaoAsync(string destinatario, string token)
        {
            var smtpConfig = _configuration.GetSection("Smtp");

            var assunto = "Confirmação de E-mail - TravelAgency";

            var corpo = $@"
    <p>Olá,</p>
    <p>Obrigado por se cadastrar na TravelAgency!</p>
    <p>Para ativar sua conta, clique no link abaixo:</p>
    <p><a href='http://localhost:5000/api/auth/confirmar-email?email={WebUtility.UrlEncode(destinatario)}&token={WebUtility.UrlEncode(token)}'>
        Confirmar E-mail
    </a></p>
    <p>Este link é válido por 24 horas.</p>
    <p>Se você não solicitou este cadastro, ignore este e-mail.</p>";

            var smtpClient = new SmtpClient(smtpConfig["Host"])
            {
                Port = int.Parse(smtpConfig["Port"]),
                Credentials = new NetworkCredential(smtpConfig["User"], smtpConfig["Password"]),
                EnableSsl = true
            };

            var mensagem = new MailMessage
            {
                From = new MailAddress(smtpConfig["User"]),
                Subject = assunto,
                Body = corpo,
                IsBodyHtml = true
            };

            mensagem.To.Add(destinatario);

            await smtpClient.SendMailAsync(mensagem);
        }
    }
}
