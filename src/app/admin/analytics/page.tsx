import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db/prisma";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  CreditCard,
  DollarSign,
  Activity,
  Eye,
  Unlock
} from "lucide-react";

export default async function AdminAnalyticsPage() {
  // Get comprehensive analytics data
  const [
    userStats,
    comicStats, 
    transactionStats,
    topComics,
    recentActivity,
    creditStats
  ] = await Promise.all([
    // User analytics
    Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ 
        where: { 
          createdAt: { 
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          } 
        } 
      }),
      prisma.user.count({ 
        where: { 
          createdAt: { 
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
          } 
        } 
      })
    ]),
    
    // Comic analytics
    Promise.all([
      prisma.comic.count(),
      prisma.comic.count({ where: { status: "ONGOING" } }),
      prisma.comic.count({ where: { featured: true } }),
      prisma.chapter.count(),
      prisma.page.count()
    ]),
    
    // Transaction analytics
    Promise.all([
      prisma.transaction.count({ where: { status: "CONFIRMED" } }),
      prisma.transaction.aggregate({
        where: { 
          type: "PURCHASE", 
          status: "CONFIRMED" 
        },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { 
          type: "SPEND", 
          status: "CONFIRMED" 
        },
        _sum: { amount: true }
      }),
      prisma.transaction.count({
        where: {
          status: "CONFIRMED",
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ]),
    
    // Top performing comics
    prisma.comic.findMany({
      include: {
        volumes: {
          include: {
            chapters: {
              include: {
                unlocks: {
                  select: { creditsSpent: true }
                }
              }
            }
          }
        }
      }
    }).then(comics => 
      comics
        .map(comic => {
          const totalUnlocks = comic.volumes.reduce((total, volume) => 
            total + volume.chapters.reduce((chapterTotal, chapter) => 
              chapterTotal + chapter.unlocks.length, 0
            ), 0
          );
          const totalRevenue = comic.volumes.reduce((total, volume) => 
            total + volume.chapters.reduce((chapterTotal, chapter) => 
              chapterTotal + chapter.unlocks.reduce((unlockTotal, unlock) => 
                unlockTotal + unlock.creditsSpent, 0
              ), 0
            ), 0
          );
          return { ...comic, totalUnlocks, totalRevenue };
        })
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5)
    ),
    
    // Recent activity
    prisma.transaction.findMany({
      where: { status: "CONFIRMED" },
      include: {
        user: {
          select: {
            username: true,
            walletAddress: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    
    // Credit distribution
    prisma.user.aggregate({
      _sum: { creditsBalance: true },
      _avg: { creditsBalance: true },
      _max: { creditsBalance: true }
    })
  ]);

  const [totalUsers, adminUsers, weeklyUsers, monthlyUsers] = userStats;
  const [totalComics, ongoingComics, featuredComics, totalChapters, totalPages] = comicStats;
  const [totalTransactions, creditsIssued, creditsSpent, dailyTransactions] = transactionStats;

  const analyticsCards = [
    {
      title: "Platform Growth",
      items: [
        { label: "Total Users", value: totalUsers.toLocaleString(), icon: Users },
        { label: "New This Week", value: weeklyUsers.toLocaleString(), icon: TrendingUp },
        { label: "New This Month", value: monthlyUsers.toLocaleString(), icon: Activity },
        { label: "Administrators", value: adminUsers.toLocaleString(), icon: Users },
      ]
    },
    {
      title: "Content Metrics",
      items: [
        { label: "Total Comics", value: totalComics.toLocaleString(), icon: BookOpen },
        { label: "Ongoing Series", value: ongoingComics.toLocaleString(), icon: Activity },
        { label: "Featured Comics", value: featuredComics.toLocaleString(), icon: Eye },
        { label: "Total Chapters", value: totalChapters.toLocaleString(), icon: BookOpen },
        { label: "Total Pages", value: totalPages.toLocaleString(), icon: BookOpen },
      ]
    },
    {
      title: "Financial Overview",
      items: [
        { label: "Credits Purchased", value: (creditsIssued._sum.amount || 0).toLocaleString(), icon: CreditCard },
        { label: "Credits Spent", value: Math.abs(creditsSpent._sum.amount || 0).toLocaleString(), icon: Unlock },
        { label: "Active Balance", value: (creditStats._sum.creditsBalance || 0).toLocaleString(), icon: DollarSign },
        { label: "Avg Balance", value: Math.round(creditStats._avg.creditsBalance || 0).toLocaleString(), icon: TrendingUp },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Platform performance and user engagement metrics
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {analyticsCards.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <Badge variant="secondary">{item.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Performing Comics */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Comics</CardTitle>
            <CardDescription>
              Comics by revenue generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topComics.map((comic, index) => (
                <div key={comic.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{comic.title}</div>
                      <div className="text-sm text-muted-foreground">
                        by {comic.author}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {comic.totalRevenue} credits
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {comic.totalUnlocks} unlocks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          transaction.type === "PURCHASE" ? "default" :
                          transaction.type === "SPEND" ? "secondary" :
                          transaction.type === "REFUND" ? "destructive" :
                          "outline"
                        }
                      >
                        {transaction.type}
                      </Badge>
                      <span className="text-sm">
                        {transaction.user.username || "Anonymous"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
          <CardDescription>
            Today's platform activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{dailyTransactions}</div>
              <div className="text-sm text-muted-foreground">Transactions Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(((creditStats._max.creditsBalance || 0) / Math.max(totalUsers, 1)) * 100) / 100}
              </div>
              <div className="text-sm text-muted-foreground">Avg Credits/User</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {totalComics > 0 ? Math.round(totalChapters / totalComics) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Chapters/Comic</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {totalChapters > 0 ? Math.round(totalPages / totalChapters) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Pages/Chapter</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}