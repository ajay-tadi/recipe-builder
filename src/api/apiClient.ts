import axios, { type AxiosRequestConfig, type Method } from "axios";
import { API_BASE_URL } from "./constants";
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});
export interface ApiRequest<TBody = unknown> {
  method: Method;
  url: string;
  data?: TBody;
  headers?: AxiosRequestConfig["headers"];
  params?: AxiosRequestConfig["params"];
  signal?: AbortSignal;
}
export async function apiClient<TResponse, TBody = unknown>(
  request: ApiRequest<TBody>,
): Promise<TResponse> {
  const response = await client.request<TResponse>(request);
  return response.data;
}
