import { AppError } from "./AppError";

type SupabaseLikeError = {
  message: string;
  status?: number;
  code?: string;
};

function isSupabaseError(error: unknown): error is SupabaseLikeError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  );
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isSupabaseError(error)) {
    switch (error.code) {
      case "invalid_credentials":
        return new AppError("Invalid email or password", "auth");

      case "email_not_confirmed":
        return new AppError("Please confirm your email address", "auth");

      case "email_address_invalid":
        return new AppError("Invalid email address", "validation");

      case "too_many_requests":
        return new AppError(
          "Too many requests. Please try again later.",
          "auth",
        );
    }

    if (error.status === 401) {
      return new AppError("Unauthorized", "auth");
    }

    if (error.status === 403) {
      return new AppError("Access denied", "auth");
    }

    if (error.status === 404) {
      return new AppError(error.message, "validation");
    }

    if (error.status === 409) {
      return new AppError(error.message, "validation");
    }

    if (error.status === 422) {
      return new AppError(error.message, "validation");
    }

    if (error.status && error.status >= 500) {
      return new AppError(
        "Server error. Please try again later.",
        "server",
      );
    }

    return new AppError(error.message, "unknown");
  }

  if (error instanceof TypeError) {
    return new AppError(
      "Unable to connect. Please check your internet connection.",
      "network",
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message, "unknown");
  }

  return new AppError("Something went wrong", "unknown");
}
