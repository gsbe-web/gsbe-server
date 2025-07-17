import { QueryDto } from '../../shared/dto/pagination.dto';
type Filter = {
  pageFilter: { skip: number; take: number; orderBy: object };
  searchFilter?: object;
};

export function generateFilter<T extends QueryDto>(queryParams: T): Filter {
  const offset = (queryParams.page - 1) * queryParams.pageSize;

  const output: Filter = {
    pageFilter: {
      take: queryParams.pageSize,
      skip: offset,
      orderBy: { updatedAt: -1 },
    },
  };

  if (queryParams.search && queryParams.searchFields) {
    const searchBodies = queryParams.searchFields.map((field) => ({
      [field]: new RegExp(queryParams.search, 'i'),
    }));
    queryParams.searchQueries = searchBodies;
    output.searchFilter = {
      $or: queryParams.searchQueries,
    };
  }

  return output;
}
