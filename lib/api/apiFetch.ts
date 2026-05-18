import { ApiError } from "./api.errors";
import { ApiResponse, SuccessResponse } from "./api.types";

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<SuccessResponse<T>> {
  const response = await fetch(input, init);

  let result: ApiResponse<T>;

  try {
    result = await response.json();
  } catch (error) {
    throw new Error(`Invalid server response: ${error}`);
  }

  if (!response.ok || !result.success) {
    const message = !result.success ? result.error : "Requested failed";
    const errors = !result.success ? result.errors : undefined;
    throw new ApiError(message, errors);
  }

  return result;
}
