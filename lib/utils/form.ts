export function getFormErrors(errors: Record<string, any>) {
  return Object.entries(errors).reduce((acc, [key, value]) => {
    acc[key] = value.message;
    return acc;
  }, {} as Record<string, string>);
}

export function formatFormError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}