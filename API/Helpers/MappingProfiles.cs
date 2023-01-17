using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(dto => dto.ProductType,
                    o => o.MapFrom(s => s.ProductType.Name))
                .ForMember(dto => dto.ProductBrand,
                    o => o.MapFrom(s => s.ProductBrand.Name))
                .ForMember(dto => dto.PictureUrl,
                o => o.MapFrom<ProductUrlResolver>());


            CreateMap<Address, AddressDto>().ReverseMap();
        }
    }
}