export function PageHeader() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/90">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
              PlaySonic
            </h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">User Analysis Dashboard</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-gray-500">Multi-Agent Data Analysis Pipeline</p>
            <p className="text-xs text-teal-600 font-medium mt-1">Graduation Project</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function PageFooter() {
  return (
    <footer className="text-center py-8 border-t border-gray-200 mt-12 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-600 font-medium">
          PlaySonic User Analysis Dashboard
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Graduation Project • Built with Multi-Agent Pipeline • Next.js & Tailwind
        </p>
        <p className="text-[10px] text-gray-400 mt-4">
          © {new Date().getFullYear()} PlaySonic Analytics
        </p>
      </div>
    </footer>
  );
}
