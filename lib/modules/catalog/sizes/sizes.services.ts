import { SizesRepository } from "./sizes.repository";
import { SizeOption } from "./sizes.types";

export async function getSizeOptions(
  sizesRepo: SizesRepository,
): Promise<SizeOption[]> {
  const sizeDocuments = await sizesRepo.findAll();

  return sizeDocuments.map((size) => ({
    name: size.name,
    slug: size.slug,
  }));
}
