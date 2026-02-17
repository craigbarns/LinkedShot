
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { STYLES } from '@/lib/styles';
import { Sparkles, Briefcase, UserCheck, Zap, Camera, Star } from 'lucide-react';

function StatusComponent() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<string>('starter');

    // Style Selection
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
    const categories = Array.from(new Set(STYLES.map(s => s.category)));
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    // Customization States
    const [attitude, setAttitude] = useState<'serious' | 'friendly' | 'charismatic'>('serious');
    const [outfit, setOutfit] = useState<string>('suit');
    const [editorial, setEditorial] = useState(false);
    const [prompt, setPrompt] = useState(''); // Extra manual prompt

    // Cinematic Loading State
    const [loadingPhase, setLoadingPhase] = useState(0);
    const loadingMessages = [
        "🧠 Analyzing facial structure...",
        "💡 Setting up virtual studio lighting...",
        "📸 Positioning camera (85mm lens)...",
        "🎨 Developing raw image...",
        "✨ Applying professional retouching..."
    ];

    // LinkedIn Preview State
    const [showLinkedInPreview, setShowLinkedInPreview] = useState(false);

    // Generating State (Must be declared before useEffect uses it)
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (generating) {
            setLoadingPhase(0);
            const interval = setInterval(() => {
                setLoadingPhase(p => (p < loadingMessages.length - 1 ? p + 1 : p));
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [generating]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    // Poll status
    useEffect(() => {
        if (!jobId) return;
        let intervalId: NodeJS.Timeout;
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/jobs/check?jobId=${jobId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.job) {
                        setJob(data.job);
                        setPlan(data.job.plan || 'starter');
                        if (data.job.result_images && Array.isArray(data.job.result_images)) {
                            setHistory(data.job.result_images.slice().reverse());
                            if (!generatedImage && data.job.result_images.length > 0) {
                                setGeneratedImage(data.job.result_images[data.job.result_images.length - 1]);
                            }
                        }
                        if (['completed', 'training_completed', 'failed'].includes(data.job.status)) {
                            setLoading(false);
                            return true;
                        }
                    }
                }
            } catch (e) { console.error('Polling error', e); }
            return false;
        };
        checkStatus().then((stop) => { if (!stop) intervalId = setInterval(async () => { if (await checkStatus()) clearInterval(intervalId); }, 5000); });
        return () => { if (intervalId) clearInterval(intervalId); };
    }, [jobId, generatedImage]);

    // Apply Smart Packs
    const applyPack = (packName: string) => {
        if (packName === 'Conqueror') {
            const style = STYLES.find(s => s.id === 'executive_dark') || STYLES[0];
            setSelectedStyle(style);
            setSelectedCategory(style.category);
            setAttitude('charismatic');
            setOutfit('suit');
            setEditorial(true);
        } else if (packName === 'Approachable') {
            const style = STYLES.find(s => s.id === 'modern_office') || STYLES[0];
            setSelectedStyle(style);
            setSelectedCategory(style.category);
            setAttitude('friendly');
            setOutfit('smart_casual');
            setEditorial(false);
        } else if (packName === 'Expert') {
            const style = STYLES.find(s => s.id === 'warm_library') || STYLES[0];
            setSelectedStyle(style);
            setSelectedCategory(style.category);
            setAttitude('serious');
            setOutfit('suit');
            setEditorial(false);
        }
    };

    const handleGenerate = async () => {
        if (!jobId) return;
        setGenerating(true);
        setError(null);
        setGeneratedImage(null);

        let modifiers = "";

        // Attitude logic
        if (attitude === 'serious') modifiers += ", composed expression, minimal smile, authoritative presence";
        else if (attitude === 'friendly') modifiers += ", warm natural smile, approachable, friendly eyes";
        else if (attitude === 'charismatic') modifiers += ", intense eye contact, commanding presence, slight smirk, confident energy";

        // Outfit logic
        if (outfit === 'suit') modifiers += ", wearing a tailored navy suit, white shirt, subtle tie, elegant and understated";
        else if (outfit === 'smart_casual') modifiers += ", wearing a blazer over a plain crew-neck, modern and approachable";
        else if (outfit === 'casual') modifiers += ", wearing a simple solid-color top, clean and professional";

        // Editorial Mode
        if (editorial) modifiers += ", editorial photography style, slightly desaturated tones, cinematic lighting, shot on medium format";

        const combinedCustomPrompt = `${prompt}${modifiers}`;

        try {
            const res = await fetch('/api/jobs/generate', {
                method: 'POST',
                body: JSON.stringify({ jobId, prompt: combinedCustomPrompt, styleId: selectedStyle.id }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Server Error: ${res.status}`);
            if (data.imageUrl) {
                setGeneratedImage(data.imageUrl);
                setHistory(prev => [data.imageUrl, ...prev]);
            } else throw new Error('No image returned');
        } catch (e: any) { setError(e.message); }
        finally { setGenerating(false); }
    };

    const handleBatchGenerate = async () => {
        if (!jobId) return;
        setGenerating(true);
        setError(null);

        let modifiers = "";
        // Base modifiers (same as single)
        if (attitude === 'serious') modifiers += ", composed expression, minimal smile, authoritative presence";
        else if (attitude === 'friendly') modifiers += ", warm natural smile, approachable, friendly eyes";
        else if (attitude === 'charismatic') modifiers += ", intense eye contact, commanding presence, slight smirk, confident energy";

        if (outfit === 'suit') modifiers += ", wearing a tailored navy suit, white shirt, subtle tie, elegant and understated";
        else if (outfit === 'smart_casual') modifiers += ", wearing a blazer over a plain crew-neck, modern and approachable";
        else if (outfit === 'casual') modifiers += ", wearing a simple solid-color top, clean and professional";

        if (editorial) modifiers += ", editorial photography style, slightly desaturated tones, cinematic lighting, shot on medium format";

        const basePrompt = `${prompt}${modifiers}`;
        const variations = [
            "looking slightly to the left",
            "looking slightly to the right",
            "centered perfect symmetry",
            "slightly different angle"
        ];

        try {
            // Launch 4 parallel requests
            const promises = variations.map(v =>
                fetch('/api/jobs/generate', {
                    method: 'POST',
                    body: JSON.stringify({ jobId, prompt: `${basePrompt}, ${v}`, styleId: selectedStyle.id }),
                    headers: { 'Content-Type': 'application/json' }
                }).then(r => r.json())
            );

            const results = await Promise.all(promises);

            // Add all successful images to history
            const newImages = results.filter(r => r.imageUrl).map(r => r.imageUrl);

            if (newImages.length > 0) {
                setGeneratedImage(newImages[0]); // Show first one
                setHistory(prev => [...newImages, ...prev]);
            } else {
                throw new Error('Batch generation failed');
            }

        } catch (e: any) { setError(e.message); }
        finally { setGenerating(false); }
    };

    if (!jobId) return <div className="text-center p-10 text-white">No Job ID found</div>;

    if (loading && !['completed', 'training_completed', 'failed'].includes(job?.status)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-bold text-white mb-2">Training your AI Model...</h2>
                <p className="text-gray-300 text-center max-w-md">This takes ~5-10 mins. <br />You can close this page.</p>
                <div className="mt-8 w-64 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full w-2/3 animate-pulse rounded-full"></div>
                </div>
            </div>
        );
    }

    if (job?.status === 'failed') return <div className="text-center p-10 text-red-500">Training Failed. Please contact support.</div>;

    const filteredStyles = STYLES.filter(s => s.category === selectedCategory);

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto pt-20">
            <div className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-400 drop-shadow-sm mb-4">
                    Professional Headshot Studio 📸
                </h1>
                <div className="flex flex-col items-center gap-2">
                    <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-bold text-blue-300 uppercase tracking-widest">
                        {plan === 'executive' ? '👑 Executive Plan Active' : plan === 'pro' ? '⚡ Professional Plan Active' : 'Starter Plan Active'}
                    </div>

                    {job?.redo_available && (
                        <button
                            onClick={async () => {
                                if (!confirm('This will archive your current model and allow you to upload new photos to retrain. \n\nIMPORTANT for better results:\n- Use different photos\n- Good lighting\n- No sunglasses\n- Variety of angles\n\nContinue?')) return;
                                try {
                                    setLoading(true);
                                    const res = await fetch(`/api/jobs/${jobId}/redo`, { method: 'POST' });
                                    const data = await res.json();
                                    if (data.success) {
                                        window.location.href = `/upload?jobId=${jobId}&redo=true`;
                                    } else {
                                        alert(data.error || 'Redo failed');
                                        setLoading(false);
                                    }
                                } catch (e) { console.error(e); setLoading(false); }
                            }}
                            className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer mt-1"
                        >
                            ↺ Not happy? Retrain Model (1 Free Redo Available)
                        </button>
                    )}

                    {plan === 'starter' && (
                        <div className="flex flex-col items-center gap-1 mt-2">
                            {/* Contextual Upsell for Training Completed */}
                            {job?.status === 'training_completed' && (
                                <div className="animate-pulse text-amber-300 text-xs font-bold mb-1">
                                    🚀 Model Ready! Upgrade now for 4K on your first batch.
                                </div>
                            )}

                            <button
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        const res = await fetch('/api/jobs/upgrade', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ jobId })
                                        });
                                        const data = await res.json();
                                        if (data.url) window.location.href = data.url;
                                        else throw new Error(data.error || 'Upgrade failed');
                                    } catch (e) { console.error(e); setLoading(false); alert('Error starting upgrade'); }
                                }}
                                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-amber-500/20"
                            >
                                ⚡ Get 4K + More Styles (+$20)
                            </button>
                            <div className="text-[10px] text-gray-400 flex gap-3 font-medium tracking-wide">
                                <span>✨ Sharper details</span>
                                <span>🎨 Realistic skin</span>
                                <span>🚀 Priority</span>
                            </div>
                        </div>
                    )}

                    {/* Credit Counter */}
                    {job?.credits_total && (
                        <div className="mt-2 text-xs font-mono text-gray-500">
                            Credits: <span className={(job.credits_used || 0) >= job.credits_total ? 'text-red-400' : 'text-white'}>{job.credits_used || 0}</span> / {job.credits_total}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Packs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button onClick={() => applyPack('Conqueror')} className="group p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all flex items-center gap-4">
                    <div className="bg-blue-600/20 p-3 rounded-lg text-blue-400 group-hover:scale-110 transition-transform"><Star size={24} /></div>
                    <div className="text-left">
                        <h3 className="font-bold text-white group-hover:text-blue-300">The Conqueror</h3>
                        <p className="text-xs text-gray-500">Power, Charisma, Dark Background</p>
                    </div>
                </button>
                <button onClick={() => applyPack('Approachable')} className="group p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl hover:border-green-500/50 transition-all flex items-center gap-4">
                    <div className="bg-green-600/20 p-3 rounded-lg text-green-400 group-hover:scale-110 transition-transform"><UserCheck size={24} /></div>
                    <div className="text-left">
                        <h3 className="font-bold text-white group-hover:text-green-300">The Approachable</h3>
                        <p className="text-xs text-gray-500">Friendly, Open, Modern Office</p>
                    </div>
                </button>
                <button onClick={() => applyPack('Expert')} className="group p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-xl hover:border-amber-500/50 transition-all flex items-center gap-4">
                    <div className="bg-amber-600/20 p-3 rounded-lg text-amber-400 group-hover:scale-110 transition-transform"><Briefcase size={24} /></div>
                    <div className="text-left">
                        <h3 className="font-bold text-white group-hover:text-amber-300">The Expert</h3>
                        <p className="text-xs text-gray-500">Serious, Trustworthy, Bookshelf</p>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 glass-card p-6 md:p-8 rounded-2xl flex flex-col h-full bg-slate-900/50 border border-slate-700/50">
                    <div className="mb-6">
                        <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold block mb-2 px-1">Style</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => { setSelectedCategory(cat); setSelectedStyle(STYLES.find(s => s.category === cat) || STYLES[0]); }} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-white/5 text-gray-400 border-white/5'}`}>{cat}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredStyles.map((style) => (
                            <button key={style.id} onClick={() => setSelectedStyle(style)} className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 text-center group relative overflow-hidden ${selectedStyle.id === style.id ? 'bg-blue-600/20 border-blue-400' : 'bg-black/20 border-white/5'}`}>
                                <span className="text-2xl group-hover:scale-110 transform transition-transform">{style.icon}</span>
                                <span className={`text-xs font-medium ${selectedStyle.id === style.id ? 'text-blue-300' : 'text-gray-400'}`}>{style.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6 mb-8 bg-black/20 p-5 rounded-xl border border-white/5">
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold block mb-2">Vibe & Attitude</label>
                            <div className="flex bg-black/40 p-1 rounded-lg gap-1">
                                {['serious', 'friendly', 'charismatic'].map((opt) => (
                                    <button key={opt} onClick={() => setAttitude(opt as any)} className={`flex-1 py-2 text-xs font-medium rounded-md capitalize transition-all ${attitude === opt ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'}`}>
                                        {opt === 'charismatic' ? '✨ Charisma' : opt === 'serious' ? '😐 Serious' : '🙂 Friendly'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold block mb-2">Outfit</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[{ id: 'suit', label: 'Suit 👔' }, { id: 'smart_casual', label: 'Blazer 🧥' }, { id: 'casual', label: 'Casual 👕' }].map((opt) => (
                                    <button key={opt.id} onClick={() => setOutfit(opt.id)} className={`py-2 text-xs font-bold rounded-lg border transition-all ${outfit === opt.id ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-sm' : 'bg-transparent border-white/10 text-gray-500'}`}>{opt.label}</button>
                                ))}
                            </div>
                        </div>

                        {/* Editorial Checkbox */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="text-amber-400"><Camera size={16} /></span>
                                <span className="text-sm font-medium text-gray-300">Editorial Touch</span>
                            </div>
                            <button
                                onClick={() => setEditorial(!editorial)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${editorial ? 'bg-blue-600' : 'bg-gray-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${editorial ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        <button onClick={handleGenerate} disabled={generating} className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${generating ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40'}`}>
                            {generating ? <span className="flex items-center justify-center gap-2">Processing...</span> : `Generate ${selectedStyle.name} ✨`}
                        </button>

                        <button onClick={handleBatchGenerate} disabled={generating} className="w-full py-3 rounded-xl font-medium text-sm border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2">
                            <Zap size={16} /> <span>Generate Pack (4 Variations)</span>
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="glass-card p-4 md:p-8 rounded-2xl flex items-center justify-center min-h-[500px] md:min-h-[600px] relative overflow-hidden bg-black/40 border border-white/5 group shadow-2xl">

                        {/* CINEMATIC LOADING OVERLAY */}
                        {generating && (
                            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in duration-500">
                                <div className="w-32 h-32 relative mb-8">
                                    <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping"></div>
                                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl">📸</div>
                                </div>
                                <div key={loadingPhase} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white animate-fade-in-up">
                                    {loadingMessages[loadingPhase]}
                                </div>
                                <div className="mt-6 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${((loadingPhase + 1) / loadingMessages.length) * 100}%` }}></div>
                                </div>
                            </div>
                        )}

                        {generatedImage ? (
                            <div className="relative w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
                                {/* Toggle Preview Mode */}
                                <button
                                    onClick={() => setShowLinkedInPreview(!showLinkedInPreview)}
                                    className={`absolute top-4 right-4 z-30 px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${showLinkedInPreview ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-black/50 text-white border-white/20 hover:bg-black/70'}`}
                                >
                                    {showLinkedInPreview ? '👀 View Original' : '👔 LinkedIn Preview'}
                                </button>

                                {showLinkedInPreview ? (
                                    // LINKEDIN MOCKUP - ROBUST & REALISTIC
                                    <div className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl relative mt-4 border border-gray-200 font-sans mx-auto transform transition-all hover:scale-[1.01]">
                                        {/* Banner - CSS Pattern instead of Image URL */}
                                        <div className="h-28 bg-[#a0b4b7] relative">
                                            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                                        </div>

                                        <div className="px-6 pb-6 relative">
                                            {/* Profile Picture Circle with White Border */}
                                            <div className="w-36 h-36 rounded-full border-[5px] border-white shadow-sm absolute -top-20 left-6 overflow-hidden bg-white">
                                                <Image src={generatedImage} alt="Profile" fill className="object-cover" unoptimized />
                                            </div>

                                            {/* Text Content */}
                                            <div className="mt-16 text-left">
                                                <h3 className="text-2xl font-bold text-gray-900 leading-tight">Your Name</h3>
                                                <p className="text-gray-600 text-[15px] mt-1">Chief Executive Officer | Tech Innovator | Visionary Leader</p>
                                                <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                                                    <span className="text-gray-500">Paris, France</span>
                                                    <span className="text-blue-600 font-bold hover:underline cursor-pointer">Contact info</span>
                                                </p>
                                                <p className="text-blue-600 text-sm font-bold mt-3 hover:underline cursor-pointer">500+ connections</p>
                                            </div>

                                            {/* Buttons */}
                                            <div className="mt-4 flex gap-2">
                                                <button className="px-6 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full text-base font-bold transition-colors">Connect</button>
                                                <button className="px-6 py-1.5 border border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50/50 rounded-full text-base font-bold transition-colors">Message</button>
                                                <button className="px-4 py-1.5 border border-gray-600 text-gray-600 hover:bg-gray-100 rounded-full text-base font-bold transition-colors">More</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // STANDARD VIEW
                                    <div className="relative w-full max-w-sm aspect-[3/4] shadow-2xl rounded-xl overflow-hidden border border-white/10 ring-1 ring-white/20 group-hover:scale-[1.01] transition-transform duration-500">
                                        <Image src={generatedImage} alt="Generated Result" fill className="object-cover" unoptimized />
                                    </div>
                                )}

                                {!showLinkedInPreview && (
                                    <div className="mt-6 flex gap-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <a href={generatedImage} target="_blank" download className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl text-sm font-bold transition-all border border-white/10 flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95">
                                            <span>⬇️</span> Download HD
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-600 space-y-4">
                                <div className="text-7xl opacity-20 animate-bounce">✨</div>
                                <p className="font-medium text-lg text-gray-500">Pick a style or try a Quick Pack to start</p>
                            </div>
                        )}
                    </div>
                    {history.length > 0 && (
                        <div className="glass-card p-4 rounded-2xl overflow-x-auto pb-4 custom-scrollbar bg-black/20">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Your Gallery</h3>
                            <div className="flex gap-4">
                                {history.map((img, idx) => (
                                    <button key={idx} onClick={() => setGeneratedImage(img)} className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${generatedImage === img ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60 hover:opacity-100'}`}><Image src={img} alt="History" fill className="object-cover" unoptimized /></button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function StatusPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
            <StatusComponent />
        </Suspense>
    );
}
