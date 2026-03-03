"use client";

import { useState } from "react";

const examples = [
  {
    id: 1,
    name: "Luxury Handbag",
    before: "/photos/sac-avant.png",
    after: "/photos/sac-apres.png",
    description: "Ferragamo bag on messy background → Amazon white",
  },
  {
    id: 2,
    name: "White Watch",
    before: "/photos/montre-avant.png",
    after: "/photos/montre-apres.png",
    description: "Smartwatch on grey background → Clean transparent",
  },
];

export default function BeforeAfter() {
  const [active, setActive] = useState(0);
  const [slider, setSlider] = useState(50);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="examples-heading" className="mb-12 text-center text-3xl font-bold text-zinc-900">
          Du fournisseur à la fiche Amazon
        </h2>

        <div className="mb-8 grid gap-8 md:grid-cols-2">
          {examples.map((ex, idx) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => setActive(idx)}
              className={`rounded-xl p-5 text-left transition ${
                active === idx
                  ? "bg-white shadow-lg ring-2 ring-emerald-500"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }`}
            >
              <h3 className="font-bold text-zinc-900">{ex.name}</h3>
              <p className="text-sm text-zinc-600">{ex.description}</p>
            </button>
          ))}
        </div>

        {/* Vue côte à côte : Avant | Après */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border-2 border-zinc-200 bg-zinc-100 shadow-lg">
            <p className="bg-zinc-700 px-4 py-2 text-center text-sm font-bold text-white">
              Before — Original supplier photo
            </p>
            <div className="relative flex aspect-square items-center justify-center bg-zinc-200 p-4">
              <img
                src={examples[active].before}
                alt={`${examples[active].name} — original supplier photo before background removal`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-emerald-300 bg-white shadow-lg">
            <p className="bg-emerald-600 px-4 py-2 text-center text-sm font-bold text-white">
              Après — LinkedShot (fond blanc)
            </p>
            <div
              className="relative flex aspect-square items-center justify-center p-4"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <img
                src={examples[active].after}
                alt={`${examples[active].name} — Amazon-ready white background image by LinkedShot`}
                className="max-h-full max-w-full object-contain"
                style={{ backgroundColor: "#FFFFFF" }}
              />
            </div>
          </div>
        </div>

        {/* Slider pour comparer en un coup d'œil */}
        <p className="mb-4 text-center text-sm font-medium text-zinc-600">
          Or drag the slider to compare
        </p>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl aspect-[4/3]">
          <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="absolute inset-0 z-0" style={{ backgroundColor: "#FFFFFF" }} aria-hidden />
            <img
              src={examples[active].after}
              alt={`${examples[active].name} — LinkedShot result with white background`}
              className="absolute inset-0 z-[1] h-full w-full object-contain"
              style={{ backgroundColor: "#FFFFFF" }}
            />
            <span className="absolute right-4 top-4 z-10 rounded-full bg-emerald-500 px-3 py-1 text-sm font-bold text-white">
              Résultat LinkedShot
            </span>
          </div>
          <div
            className="absolute inset-0 z-[5] overflow-hidden bg-zinc-200"
            style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}
          >
            <img src={examples[active].before} alt={`${examples[active].name} before processing`} className="h-full w-full object-contain" />
            <span className="absolute left-4 top-4 rounded-full bg-zinc-700 px-3 py-1 text-sm font-bold text-white">
              Original Supplier Photo
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="absolute bottom-4 left-1/2 z-20 w-64 -translate-x-1/2 cursor-pointer accent-emerald-600"
          />
        </div>
      </div>
    </div>
  );
}
