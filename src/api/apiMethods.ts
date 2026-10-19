import { apiClient } from "./apiClient";
import type { AxiosRequestConfig } from "axios";
type Options = {
  signal?: AbortSignal;
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};
export const get = <T>(url: string, options?: Options) =>
  apiClient<T>({ method: "GET", url, ...options });
export const post = <T, B>(url: string, data: B) =>
  apiClient<T, B>({ method: "POST", url, data });
export const patch = <T, B>(url: string, data: B) =>
  apiClient<T, B>({ method: "PATCH", url, data });
export const remove = (url: string) =>
  apiClient<void>({ method: "DELETE", url });
