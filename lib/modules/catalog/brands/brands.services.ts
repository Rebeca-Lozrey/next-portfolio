import { BrandsRepository } from "./brands.repository";
import { BrandOption } from "./brands.types";

export async function getBrandOptions(
  brandsRepo: BrandsRepository,
): Promise<BrandOption[]> {
  const brandDocuments = await brandsRepo.findAll();

  return brandDocuments.map((brand) => ({
    name: brand.name,
    slug: brand.slug,
  }));
}
