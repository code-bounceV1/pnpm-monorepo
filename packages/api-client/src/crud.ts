import type { AxiosInstance } from "axios";
import type { RequestOptions } from "./types";

const buildConfig = <TBody>(
  body: TBody | undefined,
  options?: RequestOptions<TBody>,
) => {
  const headers: Record<string, string> = { ...options?.headers };

  // Auto-detect multipart
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  return {
    params: options?.params,
    headers,
    ...options?.config,
  };
};

export const createCrud = (api: AxiosInstance) => ({
  create: async <TResponse, TBody = unknown>(
    url: string,
    options?: RequestOptions<TBody>,
  ): Promise<TResponse> => {
    const body = options?.body;
    const res = await api.post<TResponse>(
      url,
      body,
      buildConfig(body, options),
    );
    return res.data;
  },

  // Dedicated multipart upload (POST)
  upload: async <TResponse>(
    url: string,
    formData: FormData,
    options?: Omit<RequestOptions<FormData>, "body">,
  ): Promise<TResponse> => {
    const res = await api.post<TResponse>(url, formData, {
      params: options?.params,
      headers: {
        ...options?.headers,
        "Content-Type": "multipart/form-data",
      },
      // Report upload progress if provided
      onUploadProgress: options?.config?.onUploadProgress,
      ...options?.config,
    });
    return res.data;
  },

  // Dedicated multipart update (PUT)
  uploadUpdate: async <TResponse>(
    url: string,
    formData: FormData,
    options?: Omit<RequestOptions<FormData>, "body">,
  ): Promise<TResponse> => {
    const res = await api.put<TResponse>(url, formData, {
      params: options?.params,
      headers: {
        ...options?.headers,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: options?.config?.onUploadProgress,
      ...options?.config,
    });
    return res.data;
  },

  read: async <TResponse>(
    url: string,
    options?: RequestOptions,
  ): Promise<TResponse> => {
    const res = await api.get<TResponse>(url, buildConfig(undefined, options));
    return res.data;
  },

  update: async <TResponse, TBody = unknown>(
    url: string,
    options?: RequestOptions<TBody>,
  ): Promise<TResponse> => {
    const body = options?.body;
    const res = await api.put<TResponse>(url, body, buildConfig(body, options));
    return res.data;
  },

  patch: async <TResponse, TBody = unknown>(
    url: string,
    options?: RequestOptions<TBody>,
  ): Promise<TResponse> => {
    const body = options?.body;
    const res = await api.patch<TResponse>(
      url,
      body,
      buildConfig(body, options),
    );
    return res.data;
  },

  delete: async <TResponse>(
    url: string,
    options?: RequestOptions,
  ): Promise<TResponse> => {
    const res = await api.delete<TResponse>(
      url,
      buildConfig(undefined, options),
    );
    return res.data;
  },
});

export type CrudClient = ReturnType<typeof createCrud>;
