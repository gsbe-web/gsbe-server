import { nanoid } from 'nanoid';

export function createSlug(title: string) {
  const partialSlug = title
    .toLowerCase()
    .replace(/[\s&]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
  const randomString = nanoid(4);
  return `${partialSlug}-${randomString}`;
}
