import React from "react";

export default function ResponsesSkeleton() {
  return (
    <div className="space-y-4">
      {/* Event Info Skeleton */}
      <div className="bg-white/10 p-4 rounded-lg animate-pulse overflow-hidden relative">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        <div className="h-5 w-40 bg-white/20 rounded mb-2"></div>
        <div className="h-4 w-64 bg-white/20 rounded mb-1"></div>
        <div className="h-4 w-52 bg-white/20 rounded"></div>
      </div>

      {/* Summary Skeleton */}
      <div className="bg-white/10 p-4 rounded-lg flex gap-6 justify-around relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        <div className="h-10 w-10 bg-white/20 rounded"></div>
        <div className="h-10 w-10 bg-white/20 rounded"></div>
        <div className="h-10 w-10 bg-white/20 rounded"></div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto relative">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        <table className="min-w-full border border-white/20 rounded-lg">
          <thead>
            <tr className="bg-white/10 text-left text-white">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Comment</th>
              <th className="px-4 py-2">Responded At</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <div className="h-4 w-32 bg-white/20 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-16 bg-white/20 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 bg-white/20 rounded"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-28 bg-white/20 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
