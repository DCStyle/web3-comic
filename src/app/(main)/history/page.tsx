import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ReadingHistoryTimeline } from "@/components/history/ReadingHistoryTimeline";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/connect-wallet");
  }

  // Fetch comprehensive reading history
  const readingHistory = await prisma.readingProgress.findMany({
    where: { userId: session.user.id },
    include: {
      chapter: {
        include: {
          pages: { select: { id: true } },
          volume: {
            include: {
              comic: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  coverImage: true,
                  author: true,
                  genre: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  // Group by date for timeline display
  const groupedHistory = readingHistory.reduce((acc, item) => {
    const date = new Date(item.updatedAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof readingHistory>);

  // Calculate stats
  const stats = {
    totalSessions: readingHistory.length,
    uniqueComics: new Set(readingHistory.map(h => h.chapter.volume.comic.id)).size,
    totalPages: readingHistory.reduce((sum, h) => sum + h.pageNumber, 0),
    averagePages: readingHistory.length > 0 ? 
      Math.round(readingHistory.reduce((sum, h) => sum + h.pageNumber, 0) / readingHistory.length) : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Reading History</h1>
          <p className="text-white/70">
            Your complete reading journey and progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.totalSessions}
            </div>
            <div className="text-white/70 text-sm">Reading Sessions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.uniqueComics}
            </div>
            <div className="text-white/70 text-sm">Comics Read</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.totalPages}
            </div>
            <div className="text-white/70 text-sm">Pages Read</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.averagePages}
            </div>
            <div className="text-white/70 text-sm">Avg Pages/Session</div>
          </div>
        </div>

        {/* History Timeline */}
        {Object.keys(groupedHistory).length > 0 ? (
          <ReadingHistoryTimeline groupedHistory={groupedHistory} />
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 max-w-md mx-auto">
              <div className="text-6xl mb-6">📖</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No reading history yet
              </h2>
              <p className="text-white/70 mb-6">
                Start reading comics to build your history and track your progress.
              </p>
              <a
                href="/comics"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse Comics
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}