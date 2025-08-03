using AutoMapper;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;

namespace WebApplication1.Services
{
    public class PackageService
    {
        private readonly IRepository<Package, int> _repository;
        private readonly IMapper _mapper;

        public PackageService(IRepository<Package, int> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Package> CreateAsync(CreatePackageDto dto)
        {
            ValidarDatas(dto.DataInicio, dto.DataFim);

            var package = _mapper.Map<Package>(dto);
            await _repository.AddAsync(package);
            return package;
        }

        public async Task<Package> UpdateAsync(int id, CreatePackageDto dto)
        {
            ValidarDatas(dto.DataInicio, dto.DataFim);

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Pacote", id);

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);
            return existing;
        }

        private void ValidarDatas(DateTime inicio, DateTime fim)
        {

            if (fim.Date < inicio.Date)
                throw new BusinessException("A data final não pode ser anterior à data inicial.");

        }
    }
}
