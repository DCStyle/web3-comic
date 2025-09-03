"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Popular Genres Skeleton */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse" />
            <div className="w-32 h-5 bg-white/20 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trending Genres */}
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg animate-pulse" />
                    <div className="space-y-1">
                      <div className="w-16 h-4 bg-white/30 rounded animate-pulse" />
                      <div className="w-20 h-3 bg-white/20 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-6 bg-orange-400/30 rounded animate-pulse" />
                    <div className="w-4 h-4 bg-orange-400/30 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Genres Grid */}
          <div className="space-y-2">
            <div className="w-24 h-4 bg-white/20 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="w-3 h-3 bg-white/20 rounded animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <div className="w-full h-3 bg-white/20 rounded animate-pulse" />
                    <div className="w-8 h-2 bg-white/20 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="pt-2 border-t border-white/10">
            <div className="w-full h-8 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Stats */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-center space-y-2">
              <div className="w-12 h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded mx-auto animate-pulse" />
              <div className="w-32 h-3 bg-white/20 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Comics Skeleton */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg animate-pulse" />
            <div className="w-28 h-5 bg-white/20 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="w-16 h-20 bg-white/20 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-full h-4 bg-white/20 rounded animate-pulse" />
                <div className="w-3/4 h-3 bg-white/20 rounded animate-pulse" />
                <div className="flex gap-1">
                  <div className="w-12 h-4 bg-white/20 rounded animate-pulse" />
                  <div className="w-14 h-4 bg-white/20 rounded animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-8 h-3 bg-white/20 rounded animate-pulse" />
                    <div className="w-12 h-3 bg-white/20 rounded animate-pulse" />
                  </div>
                  <div className="w-3 h-3 bg-white/20 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}

          {/* View More Button */}
          <div className="pt-2 border-t border-white/10">
            <div className="w-full h-8 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Quick Stats */}
          <div className="pt-2 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2 text-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="w-8 h-6 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded mx-auto animate-pulse" />
                  <div className="w-16 h-3 bg-white/20 rounded mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Section Skeleton */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg animate-pulse" />
              <div className="w-24 h-5 bg-white/20 rounded animate-pulse" />
            </div>
            <div className="w-16 h-5 bg-blue-500/30 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connect Wallet Prompt */}
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 mx-auto bg-blue-400/30 rounded animate-pulse" />
              <div className="w-48 h-4 bg-white/20 rounded mx-auto animate-pulse" />
              <div className="w-32 h-8 bg-blue-500/30 rounded mx-auto animate-pulse" />
            </div>
          </div>

          {/* Recommended Comics */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10">
                <div className="flex gap-3">
                  <div className="w-12 h-16 bg-white/20 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-4 bg-white/20 rounded animate-pulse" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-3 bg-yellow-400/30 rounded animate-pulse" />
                      <div className="w-16 h-3 bg-white/20 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-purple-400/30 rounded animate-pulse" />
                      <div className="w-24 h-3 bg-purple-200/30 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="w-12 h-3 bg-white/20 rounded animate-pulse" />
                        <div className="w-8 h-3 bg-white/20 rounded animate-pulse" />
                      </div>
                      <div className="w-3 h-3 bg-white/20 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlock CTA */}
              <div className="p-2 bg-black/20 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400/30 rounded animate-pulse" />
                    <div className="w-24 h-4 bg-white/20 rounded animate-pulse" />
                  </div>
                  <div className="w-20 h-6 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}

          {/* Personalization Note */}
          <div className="pt-3 border-t border-white/10">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-yellow-400/30 rounded animate-pulse" />
                <div className="w-32 h-4 bg-white/20 rounded animate-pulse" />
              </div>
              <div className="w-48 h-3 bg-white/20 rounded mx-auto animate-pulse" />
            </div>
          </div>

          {/* View All Button */}
          <div className="pt-2 border-t border-white/10">
            <div className="w-full h-8 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Low Credits Prompt */}
          <div className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30">
            <div className="text-center space-y-3">
              <div className="w-6 h-6 mx-auto bg-orange-400/30 rounded animate-pulse" />
              <div className="w-28 h-4 bg-white/20 rounded mx-auto animate-pulse" />
              <div className="w-40 h-3 bg-white/20 rounded mx-auto animate-pulse" />
              <div className="w-24 h-8 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}