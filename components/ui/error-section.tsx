interface ErrorSectionProps {
  title: string;
  error: Error;
}

export function ErrorSection({ title, error }: ErrorSectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load data</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    </section>
  );
}