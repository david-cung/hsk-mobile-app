import { isDefined } from './guards';

export type QueryParamPrimitive = string | number | boolean;

export type QueryParams = Record<string, QueryParamPrimitive | null | undefined>;

export type SearchParamRecord = Record<string, string | undefined>;

function splitPathAndSearch(path: string): {
  pathname: string;
  searchParams: URLSearchParams;
} {
  const queryIndex = path.indexOf('?');

  if (queryIndex === -1) {
    return {
      pathname: path,
      searchParams: new URLSearchParams(),
    };
  }

  return {
    pathname: path.slice(0, queryIndex),
    searchParams: new URLSearchParams(path.slice(queryIndex + 1)),
  };
}

function appendQueryParams(searchParams: URLSearchParams, params: QueryParams): void {
  for (const [key, value] of Object.entries(params)) {
    if (!isDefined(value)) {
      continue;
    }

    searchParams.set(key, String(value));
  }
}

export function buildUrl(path: string, params?: QueryParams): string {
  const { pathname, searchParams } = splitPathAndSearch(path);

  if (params) {
    appendQueryParams(searchParams, params);
  }

  const query = searchParams.toString();
  return query.length > 0 ? `${pathname}?${query}` : pathname;
}

export function parseSearchParams<T extends SearchParamRecord = SearchParamRecord>(
  search: string,
): T {
  const normalizedSearch = search.startsWith('?') ? search.slice(1) : search;
  const result: SearchParamRecord = {};

  if (normalizedSearch.length === 0) {
    return result as T;
  }

  const urlSearchParams = new URLSearchParams(normalizedSearch);
  urlSearchParams.forEach((value, key) => {
    result[key] = value;
  });

  return result as T;
}

export function getSearchParam(search: string, key: string): string | undefined {
  return parseSearchParams(search)[key];
}
