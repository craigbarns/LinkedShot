'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle, Star, Shield, Camera, Zap, Layout,
  Download, Users, ChevronDown, Menu, X, ArrowRight,
  CreditCard, Globe, Lock, Clock, Smile
} from 'lucide-react';
import Gallery from '@/components/Gallery';
import BeforeAfter from '@/components/BeforeAfter';
import Logo from '@/components/Logo';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number }>({ hours: 12, minutes: 0, seconds: 0 });
  const [headshotCount, setHeadshotCount] = useState(127);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Dynamic Headshot Counter
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadshotCount(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sticky Header Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit Intent Logic
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0 && !hasShownPopup) {
        setShowExitPopup(true);
        setHasShownPopup(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownPopup]);

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Upgrade Scroll
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgrade') === 'pro') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePurchase = async (plan: string) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data);
        alert('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-sans overflow-x-hidden">

      {/* STICKY HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-10 h-10" />
            <span className="font-bold text-xl tracking-tight">LinkedShot</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#examples" className="text-gray-300 hover:text-white transition-colors">Examples</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isScrolled && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span>4.9/5 (2,847 reviews)</span>
              </div>
            )}
            <button
              onClick={scrollToPricing}
              className={`px-5 py-2 rounded-full font-bold transition-all ${isScrolled ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0f172a] border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl">
            <a href="#examples" className="text-gray-300 py-2" onClick={() => setMobileMenuOpen(false)}>Examples</a>
            <a href="#how-it-works" className="text-gray-300 py-2" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#pricing" className="text-gray-300 py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <button onClick={() => { scrollToPricing(); setMobileMenuOpen(false); }} className="w-full bg-blue-600 py-3 rounded-lg font-bold">
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold mb-8 uppercase tracking-wider animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            New: Tech Founder & Executive Styles
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Look <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">hire-ready</span> on <br className="hidden md:block" />
            LinkedIn in 30 minutes
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Upload 6–10 photos. Get 40+ realistic headshots that look like you — no studio needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button
              onClick={scrollToPricing}
              className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-full hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              🚀 Get my headshots — $29
            </button>
            <a
              href="#examples"
              className="w-full sm:w-auto px-8 py-5 bg-white/5 border border-white/10 text-white text-lg font-semibold rounded-full hover:bg-white/10 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
            >
              See real examples
            </a>
          </div>

          {/* New Trust Line Under CTA */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium mb-12">
            <span className="text-yellow-400">⭐ 4.8/5</span>
            <span>•</span>
            <span>2,300+ customers</span>
            <span>•</span>
            <span className="text-green-400">1 free redo included</span>
          </div>

          {/* Trust Badges - Lower Section */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-400 text-xs font-medium opacity-80">
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-blue-400" />
              <span>Real results (no stock photos)</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-blue-400" />
              <span>Secure upload • Auto-delete in 7 days</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-green-400" />
              <span>Refund/redo policy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEFORE/AFTER SECTION */}
      <section id="examples" className="py-24 bg-[#0B1120]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Before / After: Same Profile, <span className="text-blue-400">10x More Visibility</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Thousands of professionals have already transformed their image. Here's what they achieved:</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Example 1 */}
            <div className="bg-[#162033] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group">
              <div className="grid grid-cols-2 h-64 relative">
                <div className="relative">
                  <Image src="/examples/marie-before.webp" alt="Before" fill className="object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white/80">Before</div>
                </div>
                <div className="relative">
                  <Image src="/examples/marie-after.webp" alt="After" fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs font-bold text-white shadow-lg">After</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-white">Marie, Marketing Director</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <X size={14} className="text-red-400" /> <span>Blurry selfie, kitchen background</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" /> <span className="text-white">Professional studio shot</span>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl">
                  <p className="text-blue-300 text-sm italic">“I doubled my profile views. 3 recruiters contacted me in 2 weeks.”</p>
                </div>
              </div>
            </div>

            {/* Example 2 */}
            <div className="bg-[#162033] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group">
              <div className="grid grid-cols-2 h-64 relative">
                <div className="relative">
                  <Image src="/examples/thomas-before.webp" alt="Before" fill className="object-cover sepia brightness-90 group-hover:sepia-0 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white/80">Before</div>
                </div>
                <div className="relative">
                  <Image src="/examples/thomas-after.webp" alt="After" fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs font-bold text-white shadow-lg">After</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-white">Thomas, Consultant</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <X size={14} className="text-red-400" /> <span>Outdated ID photo, stiff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" /> <span className="text-white">Dynamic shot, confident</span>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl">
                  <p className="text-blue-300 text-sm italic">“Finally a photo I recognize myself in, but better. My application response rate exploded.”</p>
                </div>
              </div>
            </div>

            {/* Example 3 */}
            <div className="bg-[#162033] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group">
              <div className="grid grid-cols-2 h-64 relative">
                <div className="relative">
                  <Image src="/examples/sophie-before.webp" alt="Before" fill className="object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white/80">Before</div>
                </div>
                <div className="relative">
                  <Image src="/examples/sophie-after.webp" alt="After" fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs font-bold text-white shadow-lg">After</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-white">Sophie, Freelancer</h3>
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <X size={14} className="text-red-400" /> <span>No photo (gray silhouette)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" /> <span className="text-white">Warm and professional</span>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl">
                  <p className="text-blue-300 text-sm italic">“My clients tell me my photo inspires confidence from the first contact.”</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={scrollToPricing}
              className="px-8 py-4 bg-white text-blue-900 text-lg font-bold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
            >
              🎯 Get the Same Result — $29
            </button>
          </div>
        </div>
      </section>

      {/* 3. "WHY US" SECTION */}
      <section className="py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/5 rotate-2 scale-150 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Why Professionals Choose Us</h2>

          <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-3 bg-white/5 p-6 border-b border-white/10 font-bold text-lg">
              <div className="col-span-1 text-gray-400">Feature</div>
              <div className="col-span-1 text-center text-gray-400">❌ Other AI Generators</div>
              <div className="col-span-1 text-center text-blue-400">✅ LinkedShot</div>
            </div>

            <div className="divide-y divide-white/5">
              {[
                { label: 'Quality', bad: 'AI only → artificial results', good: 'AI + Human Touch → natural look' },
                { label: 'Variety', bad: '50 identical photos', good: '3 Different Styles based on industry' },
                { label: 'Support', bad: 'No guidance', good: 'Personalized Guide (outfit, etc)' },
                { label: 'Language', bad: 'English-only support', good: 'US-Based Support 🇺🇸' },
                { label: 'Privacy', bad: 'Data sent overseas', good: 'US Hosting 🇺🇸 Privacy-focused' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 p-6 items-center hover:bg-white/5 transition-colors">
                  <div className="col-span-1 font-medium text-gray-300">{row.label}</div>
                  <div className="col-span-1 text-center text-gray-500 text-sm">{row.bad}</div>
                  <div className="col-span-1 text-center font-bold text-white flex items-center justify-center gap-2">
                    {row.good}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <button onClick={scrollToPricing} className="text-blue-300 font-semibold hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto mb-4">
              💼 Choose My Style — $49 <ArrowRight size={16} />
            </button>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Lock size={12} className="text-blue-400" /> Secure Payment</span>
              <span className="flex items-center gap-1"><Shield size={12} className="text-green-400" /> Money-Back Guarantee</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              ⭐⭐⭐⭐⭐ 4.9/5 Rating
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROCESS SECTION */}
      <section id="how-it-works" className="py-24 bg-[#0B1120]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-20">Your Pro Headshot in 3 Simple Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📱</div>
              <h3 className="text-2xl font-bold mb-4">1. Upload</h3>
              <p className="text-lg font-semibold text-white mb-2">Send 3-5 Photos</p>
              <p className="text-gray-400 text-sm">Selfies accepted, no pro equipment needed. <br /><span className="italic text-blue-400/80">Guide included to maximize results</span></p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:-translate-y-2 transition-transform duration-300 relative">
              <div className="absolute top-1/2 -right-4 hidden md:block text-2xl text-gray-600">→</div>
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">⚡</div>
              <h3 className="text-2xl font-bold mb-4">2. Creation</h3>
              <p className="text-lg font-semibold text-white mb-2">Our AI + Editor Work</p>
              <p className="text-gray-400 text-sm">Generation in 24 hours (2-hour Express option). <br /><span className="italic text-blue-400/80">Human quality check included</span></p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎁</div>
              <h3 className="text-2xl font-bold mb-4">3. Result</h3>
              <p className="text-lg font-semibold text-white mb-2">Receive 3 Pro Photos</p>
              <p className="text-gray-400 text-sm">LinkedIn, resume, and social media formats. <br /><span className="italic text-blue-400/80">Free revisions if needed</span></p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={scrollToPricing}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all mb-4"
            >
              🚀 Start Now — $29
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              ⭐⭐⭐⭐⭐ 4.9/5 Rating
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-[#0f172a] relative">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 animate-pulse shadow-lg shadow-red-500/20">
              🔥 Launch Offer: -50% Ends Soon • Limited Spots
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Package</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* STARTER */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all flex flex-col">
              <div className="mb-8 relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                  MOST POPULAR
                </div>
                <span className="text-sm font-bold tracking-wider text-white uppercase flex items-center gap-2"><Star size={16} fill="currentColor" className="text-yellow-400" /> Starter</span>
                <div className="flex items-baseline gap-2 mt-4 mb-2">
                  <span className="text-gray-500 line-through text-2xl">$49</span>
                  <span className="text-5xl font-bold text-white">$29</span>
                </div>
                <p className="text-gray-400 text-sm">Everything you need for a great profile.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> 1 Professional Photo</li>
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> Standard Neutral Background</li>
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> LinkedIn Optimized Format</li>
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> 48-Hour Delivery</li>
              </ul>
              <button onClick={() => handlePurchase('starter')} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg transition-all hover:scale-105 mb-2">
                Get STARTER
              </button>
            </div>

            {/* PROFESSIONAL - POPULAR */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/[0.07] relative transform flex flex-col transition-all">
              <div className="absolute top-0 right-0 bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">BEST VALUE</div>
              <div className="mb-8">
                <span className="text-sm font-bold tracking-wider text-blue-400 uppercase flex items-center gap-2">Professional</span>
                <div className="flex items-baseline gap-2 mt-4 mb-2">
                  <span className="text-gray-500 line-through text-2xl">$89</span>
                  <span className="text-4xl font-bold text-white">$49</span>
                </div>
                <p className="text-blue-200/80 text-sm">More styles, higher resolution.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle size={18} className="text-blue-400 shrink-0" /> 3 Photos (Different Styles)</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle size={18} className="text-blue-400 shrink-0" /> Custom Background</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle size={18} className="text-blue-400 shrink-0" /> Personal Branding Guide</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle size={18} className="text-blue-400 shrink-0" /> 24-Hour Delivery</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle size={18} className="text-blue-400 shrink-0" /> 1 Free Revision</li>
              </ul>
              <button onClick={() => handlePurchase('pro')} className="w-full py-4 rounded-xl border border-white/20 font-bold hover:bg-white/10 transition-colors">
                Choose PROFESSIONAL
              </button>
              <p className="text-xs text-center text-blue-200/60 font-medium mt-2">🔥 Chosen by 68% of Our Customers</p>
            </div>

            {/* EXECUTIVE */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all flex flex-col">
              <div className="mb-8">
                <span className="text-sm font-bold tracking-wider text-gray-400 uppercase">Executive</span>
                <div className="flex items-baseline gap-2 mt-4 mb-2">
                  <span className="text-gray-500 line-through text-2xl">$199</span>
                  <span className="text-4xl font-bold text-white">$99</span>
                </div>
                <p className="text-gray-400 text-sm">Maximum priority & support.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> 5 Photos + LinkedIn Banner</li>
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> 30-Minute Consultation Call</li>
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> Unlimited Revisions</li>
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> 2-Hour Delivery</li>
                <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-500 shrink-0" /> Priority Support</li>
              </ul>
              <button onClick={() => handlePurchase('executive')} className="w-full py-4 rounded-xl border border-white/20 font-bold hover:bg-white/10 transition-colors">
                Choose EXECUTIVE
              </button>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <Shield size={20} className="text-green-500" />
              <span className="font-semibold text-white">30-Day Money-Back Guarantee</span> — No Questions Asked
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-24 bg-[#0B1120]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">They Transformed Their Image</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#162033] border border-white/5 relative">
              <div className="flex text-yellow-400 mb-4">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p className="text-gray-300 italic mb-6 leading-relaxed">"I was skeptical at first, but the result is stunning. My photo no longer scares recruiters away — quite the opposite!"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image src="/examples/marie-after.webp" alt="Marie" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-white">Marie D.</div>
                  <div className="text-xs text-green-400 font-medium">Marketing Director, hired in 3 weeks</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-[#162033] border border-white/5 relative">
              <div className="flex text-yellow-400 mb-4">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p className="text-gray-300 italic mb-6 leading-relaxed">"For $39, I saved months of job searching. My profile went from 50 to 400 views per week."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image src="/examples/thomas-after.webp" alt="Thomas" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-white">Thomas L.</div>
                  <div className="text-xs text-green-400 font-medium">Consultant, 4 offers in 1 month</div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-[#162033] border border-white/5 relative">
              <div className="flex text-yellow-400 mb-4">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}</div>
              <p className="text-gray-300 italic mb-6 leading-relaxed">"English-speaking support, quick response, pro result. I recommend to all my colleagues."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image src="/examples/sophie-after.webp" alt="Sophie" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-white">Sophie M.</div>
                  <div className="text-xs text-green-400 font-medium">Freelancer, +3 clients via LinkedIn</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={scrollToPricing}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-full transition-all"
            >
              📸 Join 2,800+ Satisfied Professionals — $39
            </button>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-24 bg-[#0f172a] max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "Will it really look like me?", a: "Yes! Our technology analyzes 3-5 photos of you to create an accurate portrait. Every photo is reviewed by a human editor to ensure a natural look." },
            { q: "What photos should I send?", a: "Selfies work! Our guide explains everything: lighting, angle, expression. Even with a basic smartphone, we get excellent results." },
            { q: "What if I'm not satisfied?", a: "30-day money-back guarantee, no questions asked. We'll redo your photo or refund you, your choice." },
            { q: "How long does it take?", a: "Starter Package: 48 hours. Pro Package: 24 hours. Executive Package: 2 hours. Including weekends and holidays." },
            { q: "Is my data secure?", a: "Absolutely. US-based hosting, privacy-focused. Your photos are only used to create your portrait, never to train our models." },
          ].map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-2xl p-6 bg-white/5 hover:bg-white/[0.07] transition-colors">
              <h3 className="font-bold text-lg mb-2 text-white flex items-center justify-between">
                {faq.q}
              </h3>
              <p className="text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href="mailto:support@linkedshot.com" className="text-blue-400 hover:text-white font-medium underline underline-offset-4">
            ❓ Another Question? Chat With Us
          </a>
        </div>
      </section>

      {/* 8. URGENCY SECTION (Footer) */}
      <section className="py-20 bg-gradient-to-b from-[#0B1120] to-black border-t border-white/10 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            🔥 {headshotCount} Headshots Created Today
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">Launch Offer: <span className="text-red-500">-20%</span> Ends Sunday</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Don't miss the chance to upgrade your career for the price of a takeout meal.
          </p>

          <button
            onClick={scrollToPricing}
            className="px-10 py-5 bg-white text-black text-xl font-bold rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all w-full max-w-md"
          >
            🚀 Get My Pro Headshot Now — $39
          </button>

          <div className="mt-8 text-sm text-gray-500">
            Offer ends in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        </div>
      </section>

      {/* ACTUAL FOOTER */}
      <footer className="bg-black py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p className="mb-4">© 2026 LinkedShot. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-1 left-4 right-4 p-4 bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-2xl z-50 shadow-2xl flex flex-col items-center gap-2 animate-fade-in-up">
        <div className="flex items-center gap-2 text-xs font-medium text-yellow-400">
          <div className="flex">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}</div>
          <span className="text-gray-300">4.9/5 (2,847 reviews)</span>
        </div>
        <button
          onClick={scrollToPricing}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition-transform text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          🚀 Get my headshots — $29
        </button>
      </div>


      {/* EXIT INTENT POPUP */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
            <button onClick={() => setShowExitPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold mb-2">Wait! Don't Miss Out</h3>
              <p className="text-gray-400 mb-6">Get an extra <span className="text-green-400 font-bold">10% OFF</span> your first order.</p>
              <button onClick={() => { setShowExitPopup(false); scrollToPricing(); }} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl mb-3">
                Claim My Discount
              </button>
              <button onClick={() => setShowExitPopup(false)} className="text-sm text-gray-500 hover:text-white">No thanks, I'll pay full price</button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-40 md:mb-0 mb-16 flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-80 p-4 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <span className="font-bold">Chat Support</span>
              <button onClick={() => setIsChatOpen(false)}><X size={16} /></button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Hi! How can we help you with your headshot?</p>
            <a href="mailto:support@linkedshot.com" className="block w-full text-center py-2 bg-blue-600 rounded-lg text-sm font-bold">Email Us</a>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110">
          {isChatOpen ? <X size={24} /> : <Smile size={28} />}
        </button>
      </div>
    </main>
  );
}
