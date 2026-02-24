import { AxiosRequestConfig } from "axios";

export interface RequestOptions<TBody = unknown> {
  params?: Record<string, any>;
  body?: TBody;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}
