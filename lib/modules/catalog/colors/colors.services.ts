import { ColorsRepository } from "./colors.repository";
import { ColorOption } from "./colors.types";

export async function getColorOptions(
  colorsRepo: ColorsRepository,
): Promise<ColorOption[]> {
  const ColorDocuments = await colorsRepo.findAll();

  return ColorDocuments.map((Color) => ({
    name: Color.name,
    slug: Color.slug,
    hex: Color.hex,
    group: Color.group,
  }));
}
