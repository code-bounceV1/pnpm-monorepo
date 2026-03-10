import axios, { AxiosInstance } from "axios";
import type { CreateApiClientOptions } from "./types";

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
