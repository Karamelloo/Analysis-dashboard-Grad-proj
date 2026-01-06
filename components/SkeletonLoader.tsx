'use client';

export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-50 bg-white/80 border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12 animate-pulse">
        {/* Hero */}
        <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-300 rounded-xl"></div>
          ))}
        </div>

        {/* Charts Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="h-80 bg-gray-200 rounded-xl"></div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Charts Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="h-80 bg-gray-200 rounded-xl"></div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
        
        {/* Key Findings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </main>
    </div>
  );
}
