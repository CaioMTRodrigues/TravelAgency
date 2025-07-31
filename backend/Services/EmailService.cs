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

            var link = $"http://localhost:5000/api/user/confirmar-email?email={WebUtility.UrlEncode(destinatario)}&token={WebUtility.UrlEncode(token)}";

            var corpo = $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>
        <div style='text-align: center; margin-bottom: 20px;'>
            <img src='https://i.imgur.com/0N1VLry.png' alt='Logo TravelAgency' style='max-width: 150px;'>
        </div>
        <h2 style='color: #2c3e50;'>Confirmação de E-mail</h2>
        <p>Olá,</p>
        <p>Obrigado por se cadastrar na <strong>TravelAgency</strong>!</p>
        <p>Para ativar sua conta, clique no botão abaixo:</p>
        <p style='text-align: center;'>
            <a href='{link}'
               style='display: inline-block; padding: 12px 24px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;'>
                Confirmar E-mail
            </a>
        </p>
        <p>Este link é válido por 24 horas.</p>
        <p>Se você não solicitou este cadastro, ignore este e-mail.</p>
        <hr style='margin-top: 30px;'>
        <p style='font-size: 12px; color: #888;'>© 2025 TravelAgency. Todos os direitos reservados.</p>
    </div>";

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

        public async Task EnviarEmailRecuperacaoSenhaAsync(string destinatario, string resetLink)
        {
            var smtpConfig = _configuration.GetSection("Smtp");

            var assunto = "Recuperação de Senha - TravelAgency";

            var corpo = $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;'>
    <div style='text-align: center; margin-bottom: 20px;'>
        <img src='https://i.imgur.com/0N1VLry.png' alt='Logo TravelAgency' style='max-width: 150px;'>
    </div>
    <h2 style='color: #2c3e50;'>Recuperação de Senha</h2>
    <p>Olá,</p>
    <p>Recebemos uma solicitação para redefinir sua senha.</p>
    <p>Para criar uma nova senha, clique no botão abaixo:</p>
    <p style='text-align: center;'>
        <a href='{resetLink}'
           style='display: inline-block; padding: 12px 24px; background-color: #e67e22; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;'>
            Redefinir Senha
        </a>
    </p>
    <p>Este link é válido por 1 hora.</p>
    <p>Se você não solicitou a recuperação, ignore este e-mail.</p>
    <hr style='margin-top: 30px;'>
    <p style='font-size: 12px; color: #888;'>© 2025 TravelAgency. Todos os direitos reservados.</p>
</div>";

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
