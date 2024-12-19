interface ErrorMessageProps {
  message: string;
  error?: Error | null;
}

export function ErrorMessage({ message, error }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-lg text-red-600 mb-2">{message}</p>
      {error && process.env.NODE_ENV === 'development' && (
        <pre className="text-sm text-red-500 bg-red-50 p-4 rounded-lg overflow-auto max-w-full">
          {error.message}
        </pre>
      )}
    </div>
  );
}