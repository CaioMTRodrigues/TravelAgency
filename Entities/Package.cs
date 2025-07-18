namespace WebApplication1.Entities
{
    public class Package
    {
        public int ID_Pacote { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public string Destino { get; set; }
        public int Duracao { get; set; }
        public string Datas_Disponiveis { get; set; }
        public decimal Valor { get; set; }

        /*
    public ICollection<Reserva> Reservas { get; set; }
    public ICollection<Avaliacao> Avaliacoes { get; set; }
        */
}

}
