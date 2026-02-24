import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface CreateApiClientOptions {
  baseURL: string;
  config?: AxiosRequestConfig;
  configure?: (instance: AxiosInstance) => void;
}

export const createApiClient = ({
  baseURL,
  config,
  configure,
}: CreateApiClientOptions): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });

  if (configure) {
    configure(instance);
  }

  return instance;
};
