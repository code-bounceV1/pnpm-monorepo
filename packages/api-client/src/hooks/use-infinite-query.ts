import {
  useInfiniteQuery as useTanstackInfiniteQuery,
  type UseInfiniteQueryOptions,
  type QueryKey,
  type InfiniteData,
} from "@tanstack/react-query";
import type { CrudClient } from "../crud";
import type { RequestOptions } from "../types";

export interface PagedResponse<TItem> {
  data: TItem[];
  nextPage?: number;
  total?: number;
}

export interface UseInfiniteReadQueryOptions<TItem> extends Omit<
  UseInfiniteQueryOptions<
    PagedResponse<TItem>,
    Error,
    InfiniteData<PagedResponse<TItem>>,
    QueryKey,
    number
  >,
  "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
> {
  requestOptions?: RequestOptions;
  pageParam?: string;
  limitParam?: string;
  limit?: number;
}

export function createUseInfiniteReadQuery(crud: CrudClient) {
  return function useInfiniteReadQuery<TItem>(
    queryKey: QueryKey,
    url: string,
    options?: UseInfiniteReadQueryOptions<TItem>,
  ) {
    const {
      requestOptions,
      pageParam = "page",
      limitParam = "limit",
      limit = 20,
      ...queryOptions
    } = options ?? {};

    return useTanstackInfiniteQuery<
      PagedResponse<TItem>,
      Error,
      InfiniteData<PagedResponse<TItem>>,
      QueryKey,
      number
    >({
      queryKey,
      queryFn: ({ pageParam: page }) =>
        crud.read<PagedResponse<TItem>>(url, {
          ...requestOptions,
          params: {
            ...requestOptions?.params,
            [pageParam]: page,
            [limitParam]: limit,
          },
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      ...queryOptions,
    });
  };
}
