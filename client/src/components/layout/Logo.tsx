// client/src/components/layout/Logo.tsx
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="/" className={`flex items-center gap-2.5 ${className}`}>
      <svg
        className="h-10 w-auto"
        viewBox="0 0 800 700"
        fill="none"
        stroke="currentColor"
      >
        <line x1="100" y1="50" x2="100" y2="650" strokeWidth="8" />
        <line x1="100" y1="650" x2="490" y2="650" strokeWidth="8" />
        <line x1="700" y1="50" x2="700" y2="650" strokeWidth="8" />
        <line x1="310" y1="50" x2="700" y2="50" strokeWidth="8" />
        <path
          d="M210 160 L330 160 L300 160 L300 400 Q300 460 255 492 Q210 525 188 485"
          strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"
        />
        <line x1="293" y1="390" x2="420" y2="390" strokeWidth="18" />
        <path
          d="M420 160 L490 160 Q590 160 590 350 Q590 540 490 540 L420 540 Z"
          strokeWidth="20" strokeLinejoin="round"
        />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-extrabold tracking-tight">JTLD</span>
        <span className="text-[0.7rem] font-medium tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400">
          Consulting
        </span>
      </span>
    </a>
  )
}
