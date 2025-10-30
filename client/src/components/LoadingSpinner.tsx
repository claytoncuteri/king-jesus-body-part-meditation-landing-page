export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <svg
            className="w-16 h-16 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="text-amber-100 text-sm font-light tracking-wide">Loading King Jesus Meditation...</p>
      </div>
    </div>
  );
}
