namespace WebApplication1.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string entityName, object id)
            : base($"O(A) '{entityName}' com ID {id} não foi encontrado.") { }
    }
}
