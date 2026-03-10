import {
  useQuery as useTanstackQuery,
  useQueryClient,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import type { CrudClient } from "../crud";
import type { RequestOptions } from "../types";

export interface UseReadQueryOptions<TResponse> extends Omit<
  UseQueryOptions<TResponse, Error, TResponse, QueryKey>,
  "queryKey" | "queryFn"
> {
  requestOptions?: RequestOptions;
}

export function createUseReadQuery(crud: CrudClient) {
  return function useReadQuery<TResponse>(
    queryKey: QueryKey,
    url: string,
    options?: UseReadQueryOptions<TResponse>,
  ) {
    const { requestOptions, ...queryOptions } = options ?? {};

    return useTanstackQuery<TResponse, Error, TResponse, QueryKey>({
      queryKey,
      queryFn: () => crud.read<TResponse>(url, requestOptions),
      ...queryOptions,
    });
  };
}

export function createUsePrefetch(crud: CrudClient) {
  return function usePrefetchQuery<TResponse>(
    queryKey: QueryKey,
    url: string,
    requestOptions?: RequestOptions,
  ) {
    const queryClient = useQueryClient();

    return () =>
      queryClient.prefetchQuery({
        queryKey,
        queryFn: () => crud.read<TResponse>(url, requestOptions),
      });
  };
}
