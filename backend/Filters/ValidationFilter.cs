using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace WebApplication1.Filters
{
    // Filtro de ação que intercepta requisições antes da execução do método do controller
    public class ValidationFilter : IActionFilter
    {
        // Executado antes da ação do controller
        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Verifica se o ModelState está inválido (erros de validação)
            if (!context.ModelState.IsValid)
            {
                // Extrai os erros de validação em um dicionário: campo => mensagens de erro
                var errors = context.ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );


                // Captura o traceId da requisição
                var traceId = context.HttpContext.TraceIdentifier;

                // Cria um objeto de resposta customizado
                var response = new
                {
                    timestamp = DateTime.UtcNow, // Horário da requisição
                    status = (int)HttpStatusCode.BadRequest, // Código HTTP 400
                    traceId,
                    message = "Erro de validação nos dados enviados.", // Mensagem customizada
                    errors // Lista de erros por campo
                };

                // Define o resultado da requisição como um JSON com status 400
                context.Result = new JsonResult(response)
                {
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
        }

        // Executado após a ação do controller (não utilizado aqui)
        public void OnActionExecuted(ActionExecutedContext context) { }
    }
}
