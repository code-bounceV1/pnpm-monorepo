import { AxiosInstance } from "axios";
import { RequestOptions } from "./types";

const buildConfig = <TBody>(
  body: TBody | undefined,
  options?: RequestOptions<TBody>,
) => {
  const config = {
    params: options?.params,
    headers: options?.headers ?? {},
    ...options?.config,
  };

  // Auto-detect multipart
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  return config;
};

export const createCrud = (api: AxiosInstance) => {
  return {
    create: async <TResponse, TBody = unknown>(
      url: string,
      options?: RequestOptions<TBody>,
    ): Promise<TResponse> => {
      const body = options?.body;
      const config = buildConfig(body, options);

      const res = await api.post<TResponse>(url, body, config);
      return res.data;
    },

    read: async <TResponse>(
      url: string,
      options?: RequestOptions,
    ): Promise<TResponse> => {
      const config = buildConfig(undefined, options);

      const res = await api.get<TResponse>(url, config);
      return res.data;
    },

    update: async <TResponse, TBody = unknown>(
      url: string,
      options?: RequestOptions<TBody>,
    ): Promise<TResponse> => {
      const body = options?.body;
      const config = buildConfig(body, options);

      const res = await api.put<TResponse>(url, body, config);
      return res.data;
    },

    patch: async <TResponse, TBody = unknown>(
      url: string,
      options?: RequestOptions<TBody>,
    ): Promise<TResponse> => {
      const body = options?.body;
      const config = buildConfig(body, options);

      const res = await api.patch<TResponse>(url, body, config);
      return res.data;
    },

    delete: async <TResponse>(
      url: string,
      options?: RequestOptions,
    ): Promise<TResponse> => {
      const config = buildConfig(undefined, options);

      const res = await api.delete<TResponse>(url, config);
      return res.data;
    },
  };
};
