import { AudiencesRepository } from "./audiences.repository";
import { AudienceOption } from "./audiences.types";

export async function getAudienceOptions(
  audiencesRepo: AudiencesRepository,
): Promise<AudienceOption[]> {
  const audienceDocuments = await audiencesRepo.findAll();

  return audienceDocuments.map((audience) => ({
    name: audience.name,
    slug: audience.slug,
  }));
}
