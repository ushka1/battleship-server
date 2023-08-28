type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(possibleError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(possibleError)) return possibleError;

  try {
    return new Error(JSON.stringify(possibleError));
  } catch {
    return new Error(String(possibleError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}
