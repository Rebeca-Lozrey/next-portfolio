import { CategoriesRepository } from "./categories.repository";
import { CategoryOption } from "./categories.types";

export async function getCategoryOptions(
  categoriesRepo: CategoriesRepository,
): Promise<CategoryOption[]> {
  const categoryDocuments = await categoriesRepo.findAll();

  return categoryDocuments.map((category) => ({
    name: category.name,
    slug: category.slug,
  }));
}
