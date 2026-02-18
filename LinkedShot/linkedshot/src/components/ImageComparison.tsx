"use client";

import Image from "next/image";

type ImageComparisonProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
};

export default function ImageComparison({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
}: ImageComparisonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
        <p className="bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700">
          {beforeAlt}
        </p>
        <div className="relative aspect-square">
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <p className="bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700">
          {afterAlt}
        </p>
        <div className="relative flex aspect-square items-center justify-center bg-white">
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            className="object-contain bg-white"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
