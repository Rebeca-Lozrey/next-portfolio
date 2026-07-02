import { ItemTypesRepository } from "./itemTypes.repository";
import { ItemTypeOption } from "./itemTypes.types";

export async function getItemTypeOptions(
  itemTypesRepo: ItemTypesRepository,
): Promise<ItemTypeOption[]> {
  const ItemTypeDocuments = await itemTypesRepo.findAll();

  return ItemTypeDocuments.map((ItemType) => ({
    name: ItemType.name,
    slug: ItemType.slug,
  }));
}
