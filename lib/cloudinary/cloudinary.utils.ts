export function extractPublicId(url: string) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);

  return match ? match[1] : null;
}
