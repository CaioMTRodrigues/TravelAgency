// Define uma exceção personalizada para erros de validação
namespace WebApplication1.Exceptions
{
    public class ValidationException : Exception
    {
        // Construtor que recebe a mensagem de erro
        public ValidationException(string message) : base(message) { }
    }
}
