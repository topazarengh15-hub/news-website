export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 sm:h-96 bg-gray-200" />
            <div className="p-6 sm:p-8">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-32 mb-8" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
          </div>
        </article>
        <aside className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-3">
                  <div className="w-20 h-16 bg-gray-200 rounded flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
