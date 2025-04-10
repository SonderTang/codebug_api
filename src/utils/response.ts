import { ApiResponse } from '../types/response';

export const createApiResponse = <T>(
  success: boolean,
  code: number,
  message: string,
  data: T | null = null
): ApiResponse<T> => {
  return {
    code,
    data,
    message,
    success
  };
};