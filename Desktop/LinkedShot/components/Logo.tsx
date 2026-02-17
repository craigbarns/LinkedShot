export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <div className={`${className} relative flex items-center justify-center`}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                <defs>
                    <linearGradient id="logo_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2563EB" />
                        <stop offset="1" stopColor="#4F46E5" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Background Container */}
                <rect width="40" height="40" rx="12" fill="url(#logo_gradient)" />

                {/* Lens / Aperture Ring */}
                <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" />

                {/* Shutter Blades / Iris */}
                <path d="M20 12V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 24V28" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 20H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 20H28" stroke="white" strokeWidth="2" strokeLinecap="round" />

                {/* Central Focus Point (The 'Shot') */}
                <circle cx="20" cy="20" r="5" fill="white" />

                {/* Subtle 'L' hint integrated? Or just keep it geometric professional */}
                {/* Flash/Sparkle */}
                <path d="M30 10L27 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
            </svg>
        </div>
    );
}
