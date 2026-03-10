import type { AxiosInstance } from "axios";
import { createCrud } from "./crud";
import { createUseReadQuery, createUsePrefetch } from "./hooks/use-query";
import {
  createUseMutations,
  createUploadMutations,
} from "./hooks/use-mutation";
import { createUseInfiniteReadQuery } from "./hooks/use-infinite-query";

export function createResourceClient(api: AxiosInstance) {
  const crud = createCrud(api);

  return {
    crud,
    useReadQuery: createUseReadQuery(crud),
    usePrefetchQuery: createUsePrefetch(crud),
    useInfiniteReadQuery: createUseInfiniteReadQuery(crud),
    ...createUseMutations(crud),
    ...createUploadMutations(crud),
  };
}

export type ResourceClient = ReturnType<typeof createResourceClient>;
