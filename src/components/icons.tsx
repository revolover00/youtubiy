export function ShortsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.77 10.32l-1.6-.83L17.6 8.7a3.74 3.74 0 0 0 1.5-2.35 3.7 3.7 0 0 0-.43-2.8 3.74 3.74 0 0 0-3.24-1.87c-.65 0-1.3.17-1.87.5L6.23 5.6a3.74 3.74 0 0 0-1.5 2.35 3.7 3.7 0 0 0 .43 2.8c.33.57.8 1.04 1.37 1.38l1.6.83-1.43.79a3.74 3.74 0 0 0-1.5 2.35 3.7 3.7 0 0 0 .43 2.8 3.74 3.74 0 0 0 3.24 1.87c.65 0 1.3-.17 1.87-.5l7.33-4.22a3.74 3.74 0 0 0 1.5-2.35 3.7 3.7 0 0 0-.43-2.8 3.73 3.73 0 0 0-1.37-1.38zM10 14.65v-5.3L14.6 12 10 14.65z" />
    </svg>
  );
}

export function SubscriptionsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z" />
    </svg>
  );
}

export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 20" className={className} aria-hidden>
      <rect width="28" height="20" rx="5" fill="#FF0000" />
      <path d="M11.5 5.5v9l8-4.5-8-4.5z" fill="#fff" />
    </svg>
  );
}
