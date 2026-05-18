export type ValidationError = {
  field: string;
  message: string;
};

export class ApiError extends Error {
  errors?: ValidationError[];

  constructor(message: string, errors?: ValidationError[]) {
    super(message);

    this.name = "ApiError";
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
