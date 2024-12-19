export function LoadingBrands() {
  return (
    <div className="flex justify-center gap-6 px-4 mb-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-24 h-24 bg-gray-100 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}