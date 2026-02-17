
'use client';

import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

export default function BeforeAfter() {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => setIsResizing(true);
    const handleMouseUp = () => setIsResizing(false);

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (!isResizing || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as MouseEvent).clientX;

        const x = ((clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(x, 0), 100));
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isResizing || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Native TouchEvent has touches
        if (e.touches && e.touches.length > 0) {
            const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
            setSliderPosition(Math.min(Math.max(x, 0), 100));
        }
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchend', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isResizing]);

    return (
        <div className="w-full max-w-lg mx-auto select-none">
            <div
                ref={containerRef}
                className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-col-resize group touch-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* AFTER Image (Background) - Pro Photo - CRISP & PERFECT */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("/examples/marie-after.webp")',
                    }}
                />
                <div className="absolute top-4 right-4 bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    AFTER (AI Studio)
                </div>

                {/* BEFORE Image (Foreground) - SIMULATED BAD SELFIE (Filters) */}
                <div
                    className="absolute inset-0 bg-cover bg-center border-r-2 border-white"
                    style={{
                        backgroundImage: 'url("/examples/marie-before.webp")',
                        clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                    }}
                >
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white/80 text-xs font-bold px-3 py-1 rounded-full">
                        BEFORE (Selfie)
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600 scale-100 group-hover:scale-110 transition-transform">
                        <GripVertical size={20} />
                    </div>
                </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4 animate-pulse">
                👆 Drag to compare
            </p>
        </div>
    );
}
