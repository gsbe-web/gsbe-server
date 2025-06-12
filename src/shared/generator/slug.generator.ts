export function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[\s&]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}
