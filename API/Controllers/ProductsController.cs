using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using AutoMapper;
using API.Errors;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<ProductType> _productTypeRepository;
        private readonly IGenericRepository<ProductBrand> _productBrandRepository;
        private readonly IMapper _mapper;

        public ProductsController(
            IGenericRepository<Product> productRepository,
            IGenericRepository<ProductType> productTypeRepository,
            IGenericRepository<ProductBrand> productBrandRepository,
            IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _productBrandRepository = productBrandRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProductsAsync()
        {
            var products = await _productRepository.ListAsync(
                new ProductsWithTypesAndBrandsSpecification());

            var productsToReturn = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(productsToReturn);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productRepository.GetEntityWithSpecAsync(spec);

            if (product != null)
            {
                var productToReturnDto = _mapper.Map<Product, ProductToReturnDto>(product);

                return Ok(productToReturnDto);
            }

            return NotFound(new ApiResponse(404));
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrandsAsync()
        {
            return Ok(await _productBrandRepository.ListAllAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypesAsync()
        {
            return Ok(await _productTypeRepository.ListAllAsync());
        }
    }
}