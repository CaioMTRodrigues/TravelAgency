using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TravelAgency.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagensController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ImagensController(IWebHostEnvironment env)
        {
            _env = env;
        }

        private string ObterMimeType(string nomeArquivo)
        {
            var tipoMime = Path.GetExtension(nomeArquivo).ToLower();
            return tipoMime switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream",
            };
        }

        [HttpGet("{nome}")]
        public IActionResult Get(string nome)
        {
            var caminhoImagem = Path.Combine(_env.ContentRootPath, "imagens", nome);
            if (!System.IO.File.Exists(caminhoImagem))
                return NotFound();

            var tipoMime = ObterMimeType(nome);
            return PhysicalFile(caminhoImagem, tipoMime, enableRangeProcessing: true);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile arquivo)
        {
            if (arquivo == null || arquivo.Length == 0)
                return BadRequest("Nenhum arquivo enviado.");

            var nomeArquivo = Guid.NewGuid().ToString() + Path.GetExtension(arquivo.FileName);
            var caminho = Path.Combine(_env.ContentRootPath, "imagens", nomeArquivo);

            using var stream = new FileStream(caminho, FileMode.Create);
            await arquivo.CopyToAsync(stream);

            return Ok(new { Nome = nomeArquivo, Caminho = caminho });
        }
    }
}
