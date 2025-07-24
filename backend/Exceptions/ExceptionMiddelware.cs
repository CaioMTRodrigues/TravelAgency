using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;
using WebApplication1.Exceptions;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    // Intercepta todas as requisições e trata exceções
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); // Continua o pipeline normalmente
        }
        catch (ValidationException ex)
        {
            // Trata exceções de validação com status 400
            await HandleExceptionAsync(context, ex.Message, HttpStatusCode.BadRequest);
        }
        catch (NotFoundException ex)
        {   // Trata NotFoundException

            var traceId = context.TraceIdentifier;

            var response = new
            {
                timestamp = DateTime.UtcNow,
                status = (int)HttpStatusCode.NotFound,
                traceId,
                message = "Recurso não encontrado.",
                errors = new Dictionary<string, string[]>
        {
            { "general", new[] { ex.Message } }
        }
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.NotFound;

            var result = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(result);

        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("IX_Users_Document") == true)
        {
            var traceId = context.TraceIdentifier;

            var response = new
            {
                timestamp = DateTime.UtcNow,
                status = (int)HttpStatusCode.BadRequest,
                traceId,
                message = "Erro de validação nos dados enviados.",
                errors = new Dictionary<string, string[]>
        {
            { "Document", new[] { "Já existe um usuário com este documento." } }
        }
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

            var result = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(result);
        }

        catch (Exception ex)
        {
            // Trata exceções genéricas com status 500
            await HandleExceptionAsync(context, "Ocorreu um erro inesperado.", HttpStatusCode.InternalServerError);
        }
    }

    // Método auxiliar para formatar a resposta JSON
    private static Task HandleExceptionAsync(HttpContext context, string message, HttpStatusCode statusCode)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var result = JsonSerializer.Serialize(new { error = message });
        return context.Response.WriteAsync(result);
    }
}
