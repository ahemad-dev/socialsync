import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow animate-fadeInUp">
      {/* Title */}
      <div className="h-6 w-32 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer mb-3"></div>

      {/* Description */}
      <div className="h-4 w-48 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer mb-2"></div>
      <div className="h-4 w-36 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer mb-4"></div>

      {/* Venue */}
      <div className="h-4 w-28 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer mb-2"></div>

      {/* City/State */}
      <div className="h-4 w-24 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer mb-1"></div>
      <div className="h-4 w-20 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer mb-4"></div>

      {/* Date */}
      <div className="h-4 w-32 rounded bg-shimmer bg-[length:200%_100%] animate-shimmer mb-4"></div>

      {/* Button Placeholder */}
      <div className="h-9 w-28 rounded-lg bg-shimmer bg-[length:200%_100%] animate-shimmer"></div>
    </div>
  );
}
