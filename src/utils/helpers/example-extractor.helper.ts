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
import { Type } from '@nestjs/common';
import { DECORATORS } from '@nestjs/swagger/dist/constants';

interface SwaggerPropertyMetadata {
  type?: any;
  description?: string;
  example?: any;
  examples?: Record<string, any>;
  required?: boolean;
  nullable?: boolean;
  enum?: any[];
  default?: any;
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  items?: any;
  properties?: Record<string, any>;
  additionalProperties?: any;
  oneOf?: any[];
  anyOf?: any[];
  allOf?: any[];
}

interface ExtractedExample<T = any> {
  propertyName: keyof T;
  example?: T[keyof T];
  examples?: Record<string, T[keyof T]>;
  type?: string;
  isRequired?: boolean;
  isOptional?: boolean;
  isResponse?: boolean;
}

export function extractSwaggerExamples<T>(
  target: Type<T> | (new (...args: any[]) => T),
): ExtractedExample<T>[] {
  const prototype = typeof target === 'function' ? target.prototype : target;
  const metadataKeys = [
    DECORATORS.API_MODEL_PROPERTIES,
    DECORATORS.API_MODEL_PROPERTIES_ARRAY,
  ];

  const extractedExamples: ExtractedExample<T>[] = [];

  for (const metadataKey of metadataKeys) {
    const metadata = Reflect.getMetadata(metadataKey, prototype);

    if (metadata) {
      for (const [propertyName, propertyMetadata] of Object.entries(metadata)) {
        const meta = propertyMetadata as SwaggerPropertyMetadata;

        if (meta.example !== undefined || meta.examples !== undefined) {
          extractedExamples.push({
            propertyName: propertyName as keyof T,
            example: meta.example,
            examples: meta.examples,
            type: meta.type?.name || typeof meta.type,
            isRequired: meta.required === true,
            isOptional: meta.required === false,
            isResponse: metadataKey === DECORATORS.API_MODEL_PROPERTIES_ARRAY,
          });
        }
      }
    }
  }

  return extractedExamples;
}

// Alternative function that works with class instances
export function extractSwaggerExamplesFromInstance<T>(
  instance: T,
): ExtractedExample<T>[] {
  return extractSwaggerExamples(instance.constructor as Type<T>);
}

// Get default value for a property type
function getDefaultValue(type: any): any {
  if (!type) return undefined;

  switch (type) {
    case String:
      return '';
    case Number:
      return 0;
    case Boolean:
      return false;
    case Date:
      return new Date();
    case Array:
      return [];
    case Object:
      return {};
    default:
      // For custom classes or unknown types
      if (typeof type === 'function') {
        try {
          return new type();
        } catch {
          return {};
        }
      }
      return undefined;
  }
}

// Get all property metadata including types
function getAllPropertyMetadata<T>(
  target: Type<T> | (new (...args: any[]) => T),
): Record<string, SwaggerPropertyMetadata> {
  const prototype = typeof target === 'function' ? target.prototype : target;
  const metadataKeys = [
    DECORATORS.API_MODEL_PROPERTIES,
    DECORATORS.API_MODEL_PROPERTIES_ARRAY,
  ];

  const allMetadata: Record<string, SwaggerPropertyMetadata> = {};

  for (const metadataKey of metadataKeys) {
    const metadata = Reflect.getMetadata(metadataKey, prototype);
    if (metadata) {
      Object.assign(allMetadata, metadata);
    }
  }

  return allMetadata;
}

// Utility function to get all examples as a complete object of T
export function getExamplesAsObject<T>(
  target: Type<T> | (new (...args: any[]) => T),
): T {
  const examples = extractSwaggerExamples(target);
  const allMetadata = getAllPropertyMetadata(target);
  const result = {} as T;

  // First, set examples from decorators
  for (const item of examples) {
    if (item.example !== undefined) {
      result[item.propertyName] = item.example;
    } else if (item.examples) {
      const firstExampleKey = Object.keys(item.examples)[0];
      result[item.propertyName] = item.examples[firstExampleKey];
    }
  }

  // Then, fill in missing properties with defaults
  for (const [propertyName, metadata] of Object.entries(allMetadata)) {
    const key = propertyName as keyof T;

    if (result[key] === undefined) {
      // Check if property is optional (nullable or not required)
      const isOptional =
        metadata.required === false || metadata.nullable === true;

      if (!isOptional) {
        // Required property without example - provide default
        result[key] = getDefaultValue(metadata.type) as T[keyof T];
      }
      // Optional properties remain undefined
    }
  }

  return result;
}

// Function to create a complete example object from a class (returns T)
export function createExampleFromClass<T>(
  target: Type<T> | (new (...args: any[]) => T),
): T {
  const examples = extractSwaggerExamples(target);
  const allMetadata = getAllPropertyMetadata(target);
  const exampleObject = {} as T;

  // First, set examples from decorators
  for (const item of examples) {
    if (item.example !== undefined) {
      exampleObject[item.propertyName] = item.example;
    } else if (item.examples) {
      const firstExampleKey = Object.keys(item.examples)[0];
      exampleObject[item.propertyName] = item.examples[firstExampleKey];
    }
  }

  // Then, fill in missing properties with defaults
  for (const [propertyName, metadata] of Object.entries(allMetadata)) {
    const key = propertyName as keyof T;

    if (exampleObject[key] === undefined) {
      // Check if property is optional
      const isOptional =
        metadata.required === false || metadata.nullable === true;

      if (!isOptional) {
        // Required property without example - provide default
        exampleObject[key] = getDefaultValue(metadata.type) as T[keyof T];
      }
      // Optional properties remain undefined
    }
  }

  return exampleObject;
}

// Function to get examples filtered by decorator type
export function getExamplesByDecoratorType<T>(
  target: Type<T> | (new (...args: any[]) => T),
  decoratorType: 'property' | 'optional' | 'response' = 'property',
): ExtractedExample<T>[] {
  const allExamples = extractSwaggerExamples(target);

  switch (decoratorType) {
    case 'property':
      return allExamples.filter((ex) => ex.isRequired === true);
    case 'optional':
      return allExamples.filter((ex) => ex.isOptional === true);
    case 'response':
      return allExamples.filter((ex) => ex.isResponse === true);
    default:
      return allExamples;
  }
}

// Additional utility functions for better control

// Create example with custom defaults for missing properties
export function createExampleWithDefaults<T>(
  target: Type<T> | (new (...args: any[]) => T),
  customDefaults: Partial<T> = {},
): T {
  const examples = extractSwaggerExamples(target);
  const allMetadata = getAllPropertyMetadata(target);
  const exampleObject = {} as T;

  // First, set examples from decorators
  for (const item of examples) {
    if (item.example !== undefined) {
      exampleObject[item.propertyName] = item.example;
    } else if (item.examples) {
      const firstExampleKey = Object.keys(item.examples)[0];
      exampleObject[item.propertyName] = item.examples[firstExampleKey];
    }
  }

  // Then, apply custom defaults and fill missing properties
  for (const [propertyName, metadata] of Object.entries(allMetadata)) {
    const key = propertyName as keyof T;

    if (exampleObject[key] === undefined) {
      // First check custom defaults
      if (customDefaults[key] !== undefined) {
        exampleObject[key] = customDefaults[key]!;
      } else {
        // Check if property is optional
        const isOptional =
          metadata.required === false || metadata.nullable === true;

        if (!isOptional) {
          // Required property without example - provide default
          exampleObject[key] = getDefaultValue(metadata.type) as T[keyof T];
        }
      }
    }
  }

  return exampleObject;
}

// Create example with only properties that have examples (safe version)
export function createExampleFromExistingOnly<T>(
  target: Type<T> | (new (...args: any[]) => T),
): Partial<T> {
  const examples = extractSwaggerExamples(target);
  const exampleObject: Partial<T> = {};

  for (const item of examples) {
    if (item.example !== undefined) {
      exampleObject[item.propertyName] = item.example;
    } else if (item.examples) {
      const firstExampleKey = Object.keys(item.examples)[0];
      exampleObject[item.propertyName] = item.examples[firstExampleKey];
    }
  }

  return exampleObject;
}

// Get missing properties that don't have examples
export function getMissingExampleProperties<T>(
  target: Type<T> | (new (...args: any[]) => T),
): Array<keyof T> {
  const examples = extractSwaggerExamples(target);
  const allMetadata = getAllPropertyMetadata(target);
  const exampleProperties = new Set(examples.map((ex) => ex.propertyName));

  const missingProperties: Array<keyof T> = [];

  for (const propertyName of Object.keys(allMetadata)) {
    const key = propertyName as keyof T;
    if (!exampleProperties.has(key)) {
      missingProperties.push(key);
    }
  }

  return missingProperties;
}

// Validate that all required properties have examples
export function validateRequiredExamples<T>(
  target: Type<T> | (new (...args: any[]) => T),
): {
  isValid: boolean;
  missingRequired: Array<keyof T>;
} {
  const examples = extractSwaggerExamples(target);
  const allMetadata = getAllPropertyMetadata(target);
  const exampleProperties = new Set(examples.map((ex) => ex.propertyName));

  const missingRequired: Array<keyof T> = [];

  for (const [propertyName, metadata] of Object.entries(allMetadata)) {
    const key = propertyName as keyof T;
    const isRequired =
      metadata.required !== false && metadata.nullable !== true;

    if (isRequired && !exampleProperties.has(key)) {
      missingRequired.push(key);
    }
  }

  return {
    isValid: missingRequired.length === 0,
    missingRequired,
  };
}
export function getPropertyExample<T, K extends keyof T>(
  target: Type<T> | (new (...args: any[]) => T),
  propertyName: K,
): T[K] | undefined {
  const examples = extractSwaggerExamples(target);
  const propertyExample = examples.find(
    (ex) => ex.propertyName === propertyName,
  );

  if (propertyExample?.example !== undefined) {
    return propertyExample.example as T[K];
  }

  if (propertyExample?.examples) {
    const firstExampleKey = Object.keys(propertyExample.examples)[0];
    return propertyExample.examples[firstExampleKey] as T[K];
  }

  return undefined;
}

// Utility to get all examples for a specific property (when multiple examples exist)
export function getPropertyExamples<T, K extends keyof T>(
  target: Type<T> | (new (...args: any[]) => T),
  propertyName: K,
): Record<string, T[K]> | undefined {
  const examples = extractSwaggerExamples(target);
  const propertyExample = examples.find(
    (ex) => ex.propertyName === propertyName,
  );

  return propertyExample?.examples as Record<string, T[K]> | undefined;
}

// Type-safe function to check if a property has examples
export function hasPropertyExample<T, K extends keyof T>(
  target: Type<T> | (new (...args: any[]) => T),
  propertyName: K,
): boolean {
  const examples = extractSwaggerExamples(target);
  const propertyExample = examples.find(
    (ex) => ex.propertyName === propertyName,
  );

  return (
    propertyExample !== undefined &&
    (propertyExample.example !== undefined ||
      propertyExample.examples !== undefined)
  );
}
