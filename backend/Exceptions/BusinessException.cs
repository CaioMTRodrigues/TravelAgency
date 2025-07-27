namespace WebApplication1.Exceptions
{
    public class BusinessException : Exception
    {
        public BusinessException(string message)
            : base($"Regra de negócio violada: {message}") { }
    }
}