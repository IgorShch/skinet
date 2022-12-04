using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        private readonly ProductSpecParams _productParams;

        public ProductWithFiltersForCountSpecification(ProductSpecParams productParams)
        : base(p =>
                (string.IsNullOrEmpty(productParams.Search) || p.Name.ToLower().Contains(productParams.Search)) &&
                (!productParams.BrandId.HasValue || p.ProductBrandId == productParams.BrandId) &&
                (!productParams.TypeID.HasValue || p.ProductTypeId == productParams.TypeID)
            )
        {
            _productParams = productParams;
        }
    }
}