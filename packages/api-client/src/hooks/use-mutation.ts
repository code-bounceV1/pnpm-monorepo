import {
  useMutation as useTanstackMutation,
  useQueryClient,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import type { CrudClient } from "../crud";
import type { RequestOptions } from "../types";

export interface UseCrudMutationOptions<TResponse, TBody> extends Omit<
  UseMutationOptions<TResponse, Error, TBody>,
  "mutationFn"
> {
  invalidateKeys?: QueryKey[];
}

function useInvalidateOnSuccess<TResponse, TBody>(
  invalidateKeys: QueryKey[] | undefined,
  onSuccess: UseMutationOptions<TResponse, Error, TBody>["onSuccess"],
): UseMutationOptions<TResponse, Error, TBody>["onSuccess"] {
  const queryClient = useQueryClient();

  return async (data, variables, context, mutation) => {
    if (invalidateKeys) {
      await Promise.all(
        invalidateKeys.map((key) =>
          queryClient.invalidateQueries({ queryKey: key }),
        ),
      );
    }
    await onSuccess?.(data, variables, context, mutation);
  };
}

export function createUseMutations(crud: CrudClient) {
  function useCreateMutation<TResponse, TBody = unknown>(
    url: string,
    options?: UseCrudMutationOptions<TResponse, TBody>,
  ) {
    const { invalidateKeys, onSuccess, ...mutationOptions } = options ?? {};
    const handleSuccess = useInvalidateOnSuccess<TResponse, TBody>(
      invalidateKeys,
      onSuccess,
    );

    return useTanstackMutation<TResponse, Error, TBody>({
      mutationFn: (body: TBody) =>
        crud.create<TResponse, TBody>(url, { body } as RequestOptions<TBody>),
      onSuccess: handleSuccess,
      ...mutationOptions,
    });
  }

  function useUpdateMutation<TResponse, TBody = unknown>(
    url: string,
    options?: UseCrudMutationOptions<TResponse, TBody>,
  ) {
    const { invalidateKeys, onSuccess, ...mutationOptions } = options ?? {};
    const handleSuccess = useInvalidateOnSuccess<TResponse, TBody>(
      invalidateKeys,
      onSuccess,
    );

    return useTanstackMutation<TResponse, Error, TBody>({
      mutationFn: (body: TBody) =>
        crud.update<TResponse, TBody>(url, { body } as RequestOptions<TBody>),
      onSuccess: handleSuccess,
      ...mutationOptions,
    });
  }

  function usePatchMutation<TResponse, TBody = unknown>(
    url: string,
    options?: UseCrudMutationOptions<TResponse, TBody>,
  ) {
    const { invalidateKeys, onSuccess, ...mutationOptions } = options ?? {};
    const handleSuccess = useInvalidateOnSuccess<TResponse, TBody>(
      invalidateKeys,
      onSuccess,
    );

    return useTanstackMutation<TResponse, Error, TBody>({
      mutationFn: (body: TBody) =>
        crud.patch<TResponse, TBody>(url, { body } as RequestOptions<TBody>),
      onSuccess: handleSuccess,
      ...mutationOptions,
    });
  }

  function useDeleteMutation<TResponse>(
    url: string,
    options?: UseCrudMutationOptions<TResponse, void>,
  ) {
    const { invalidateKeys, onSuccess, ...mutationOptions } = options ?? {};
    const handleSuccess = useInvalidateOnSuccess<TResponse, void>(
      invalidateKeys,
      onSuccess,
    );

    return useTanstackMutation<TResponse, Error, void>({
      mutationFn: () => crud.delete<TResponse>(url),
      onSuccess: handleSuccess,
      ...mutationOptions,
    });
  }

  return {
    useCreateMutation,
    useUpdateMutation,
    usePatchMutation,
    useDeleteMutation,
  };
}

export function createUploadMutations(crud: CrudClient) {
  function useUploadMutation<TResponse>(
    url: string,
    options?: UseCrudMutationOptions<TResponse, FormData>,
  ) {
    const { invalidateKeys, onSuccess, ...mutationOptions } = options ?? {};
    const handleSuccess = useInvalidateOnSuccess<TResponse, FormData>(
      invalidateKeys,
      onSuccess,
    );

    return useTanstackMutation<TResponse, Error, FormData>({
      mutationFn: (formData: FormData) => crud.upload<TResponse>(url, formData),
      onSuccess: handleSuccess,
      ...mutationOptions,
    });
  }

  function useUploadUpdateMutation<TResponse>(
    url: string,
    options?: UseCrudMutationOptions<TResponse, FormData>,
  ) {
    const { invalidateKeys, onSuccess, ...mutationOptions } = options ?? {};
    const handleSuccess = useInvalidateOnSuccess<TResponse, FormData>(
      invalidateKeys,
      onSuccess,
    );

    return useTanstackMutation<TResponse, Error, FormData>({
      mutationFn: (formData: FormData) =>
        crud.uploadUpdate<TResponse>(url, formData),
      onSuccess: handleSuccess,
      ...mutationOptions,
    });
  }

  return { useUploadMutation, useUploadUpdateMutation };
}
