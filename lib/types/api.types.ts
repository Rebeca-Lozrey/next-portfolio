export type ValidationError = {
  field: string;
  message: string;
};

export type SuccessResponse<T = undefined> = {
  success: true;
  message?: string;
  data?: T;
};

export type ErrorResponse = {
  success: false;
  error: string;
  errors?: ValidationError[];
};

export type ApiResponse<T = undefined> = SuccessResponse<T> | ErrorResponse;
