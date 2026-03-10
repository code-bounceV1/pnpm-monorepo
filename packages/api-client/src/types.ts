import type { AxiosRequestConfig } from "axios";

export interface RequestOptions<TBody = unknown> {
  body?: TBody;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
}

export interface CreateApiClientOptions {
  baseURL: string;
  config?: AxiosRequestConfig;
  configure?: (instance: import("axios").AxiosInstance) => void;
}
