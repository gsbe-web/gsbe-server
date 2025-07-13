import { QueryDto } from '../../shared/dto/pagination.dto';

export function generateFilter<T extends QueryDto>(
  queryParams: T,
): {
  searchFilter: object;
  pageFilter: { skip: number; take: number; orderBy: object };
} {
  const offset = (queryParams.page - 1) * queryParams.pageSize;

  if (queryParams.search && queryParams.searchFields) {
    const searchBodies = queryParams.searchFields.map((field) => ({
      [field]: {
        contains: queryParams.search,
        mode: 'insensitive',
      },
    }));
    queryParams.searchQueries = searchBodies;
  }

  return {
    searchFilter: {
      OR: queryParams.searchQueries,
    },
    pageFilter: {
      take: queryParams.pageSize,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    },
  };
}
