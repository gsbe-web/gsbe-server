export function createSlug(title: string) {
  const partialSlug = title
    .toLowerCase()
    .replace(/[\s&]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
  const randomString = crypto.randomUUID().slice(0, 5);
  return `${partialSlug}-${randomString}`;
}
