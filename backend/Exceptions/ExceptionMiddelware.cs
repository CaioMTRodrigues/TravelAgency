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

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            await HandleDetailedExceptionAsync(context, HttpStatusCode.BadRequest, "Erro de validação nos dados enviados.", new Dictionary<string, string[]>
            {
                { "validation", new[] { ex.Message } }
            });
        }
        catch (NotFoundException ex)
        {
            await HandleDetailedExceptionAsync(context, HttpStatusCode.NotFound, "Recurso não encontrado.", new Dictionary<string, string[]>
            {
                { "general", new[] { ex.Message } }
            });
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("IX_Users_Document") == true)
        {
            await HandleDetailedExceptionAsync(context, HttpStatusCode.BadRequest, "Erro de validação nos dados enviados.", new Dictionary<string, string[]>
            {
                { "Document", new[] { "Já existe um usuário com este documento." } }
            });
        }
        catch (BusinessException ex)
        {
            await HandleDetailedExceptionAsync(context, HttpStatusCode.BadRequest, "Regra de negócio violada.", new Dictionary<string, string[]>
            {
                { "business", new[] { ex.Message } }
            });
        }
        catch (Exception)
        {
            await HandleDetailedExceptionAsync(context, HttpStatusCode.InternalServerError, "Ocorreu um erro inesperado.", null);
        }
    }

    private static Task HandleDetailedExceptionAsync(HttpContext context, HttpStatusCode statusCode, string message, Dictionary<string, string[]>? errors)
    {
        var traceId = context.TraceIdentifier;

        var response = new
        {
            timestamp = DateTime.UtcNow,
            status = (int)statusCode,
            traceId,
            message,
            errors = errors ?? new Dictionary<string, string[]>
            {
                { "general", new[] { message } }
            }
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var result = JsonSerializer.Serialize(response);
        return context.Response.WriteAsync(result);
    }
}