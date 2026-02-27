export function ModuleIcon({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 border-primary ${className ?? ""}`}
      style={{ width: 48, height: 48 }}
    >
      <svg
        width="22"
        height="18"
        viewBox="0 0 22 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="3" y="2" width="16" height="2.4" rx="1.2" className="fill-primary" />
        <rect x="3" y="7.8" width="16" height="2.4" rx="1.2" className="fill-primary" />
        <rect x="3" y="13.6" width="16" height="2.4" rx="1.2" className="fill-primary" />
      </svg>
    </div>
  )
}
