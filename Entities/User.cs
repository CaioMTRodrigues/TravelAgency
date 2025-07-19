namespace WebApplication1.Entities
{
    public class User
    {
        public int Id_User { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public string PasswordHash { get; set; }
        public string PhoneNumber { get; set; }
        public string Document { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    }
}
