export function getExamplesFromDto<T extends new (...args: any[]) => any>(
  dtoClass: T,
): InstanceType<T> {
  const metadata = Reflect.getMetadata(
    'swagger/apiModelPropertiesArray',
    dtoClass,
  );

  const examples: Record<string, any> = {};

  for (const key in metadata) {
    const property = metadata[key];
    examples[key] = property.example;
  }

  return examples as InstanceType<T>;
}
