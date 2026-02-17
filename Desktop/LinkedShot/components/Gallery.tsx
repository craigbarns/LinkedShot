'use client';

import Image from 'next/image';

const EXAMPLES = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop', // Man in suit
        title: 'Classic Studio',
        style: 'Corporate'
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop', // Woman in modern office
        title: 'Modern Office',
        style: 'Smart Casual'
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop', // Founder vibe
        title: 'Founder Vibe',
        style: 'Urban'
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', // Friendly Creative
        title: 'Creative Clean',
        style: 'Tech'
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop', // Executive
        title: 'Executive Dark',
        style: 'Premium'
    }
];

export default function Gallery() {
    return (
        <section className="container mx-auto px-4 py-16" id="examples">
            <h2 className="text-center text-3xl md:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                Premium Results
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                {EXAMPLES.map((example) => (
                    <div key={example.id} className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden group shadow-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-2">
                        <Image
                            src={example.url}
                            alt={example.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 flex flex-col justify-end p-4">
                            <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">{example.title}</h3>
                            <span className="text-xs font-medium text-blue-100 bg-blue-600/30 px-3 py-1 rounded-full w-fit backdrop-blur-md border border-blue-400/30">
                                {example.style}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
