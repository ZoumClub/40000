interface LoadingSectionProps {
  title: string;
  count?: number;
}

export function LoadingSection({ title, count = 3 }: LoadingSectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}