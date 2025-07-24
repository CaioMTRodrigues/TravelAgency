using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using System.Linq;

public class CpfOuPassaporteAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var documento = value as string;

        if (string.IsNullOrWhiteSpace(documento))
            return new ValidationResult("O documento é obrigatório.");

        if (EhCpf(documento) || EhPassaporte(documento))
            return ValidationResult.Success;

        return new ValidationResult("O documento deve ser um CPF válido ou um número de passaporte válido.");
    }

    private bool EhCpf(string cpf)
    {
        try
        {
            cpf = Regex.Replace(cpf, "[^0-9]", "");

            if (cpf.Length != 11 || cpf.Distinct().Count() == 1)
                return false;

            var multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            var multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            var tempCpf = cpf.Substring(0, 9);
            var soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];

            var resto = soma % 11;
            var digito = resto < 2 ? 0 : 11 - resto;
            tempCpf += digito;

            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];

            resto = soma % 11;
            digito = resto < 2 ? 0 : 11 - resto;

            return cpf.EndsWith(digito.ToString());
        }
        catch
        {
            return false;
        }
    }


    private bool EhPassaporte(string doc)
    {
        // Exemplo genérico: 2 letras seguidas de 6 a 9 dígitos
        return Regex.IsMatch(doc, @"^[A-Z]{2}\d{6,9}$", RegexOptions.IgnoreCase);
    }
}
