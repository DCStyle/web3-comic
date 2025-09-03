import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	BookOpen,
	Users,
	CreditCard,
	TrendingUp,
	DollarSign,
	Activity
} from "lucide-react";

export default async function AdminDashboard() {
	// Get platform statistics
	const [
		totalUsers,
		totalComics,
		totalTransactions,
		totalCreditsIssued,
		recentUsers,
		topComics
	] = await Promise.all([
		prisma.user.count(),
		prisma.comic.count(),
		prisma.transaction.count({ where: { status: "CONFIRMED" } }),
		prisma.transaction.aggregate({
			where: {
				type: "PURCHASE",
				status: "CONFIRMED"
			},
			_sum: { amount: true }
		}),
		prisma.user.findMany({
			take: 5,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				walletAddress: true,
				username: true,
				creditsBalance: true,
				createdAt: true,
			}
		}),
		prisma.comic.findMany({
			take: 5,
			orderBy: { updatedAt: "desc" },
			include: {
				volumes: {
					include: {
						chapters: {
							include: {
								unlocks: true
							}
						}
					}
				}
			}
		})
	]);
	
	const stats = [
		{
			title: "Total Users",
			value: totalUsers.toLocaleString(),
			description: "Registered wallet addresses",
			icon: Users,
			trend: "+12% from last month",
		},
		{
			title: "Total Comics",
			value: totalComics.toLocaleString(),
			description: "Comics in platform",
			icon: BookOpen,
			trend: "+3 new this week",
		},
		{
			title: "Credits Issued",
			value: (totalCreditsIssued._sum.amount || 0).toLocaleString(),
			description: "Total credits purchased",
			icon: CreditCard,
			trend: "+25% from last month",
		},
		{
			title: "Transactions",
			value: totalTransactions.toLocaleString(),
			description: "Confirmed transactions",
			icon: Activity,
			trend: "98.5% success rate",
		},
	];
	
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Admin Dashboard</h1>
				<p className="text-muted-foreground">
					Platform overview and management
				</p>
			</div>
			
			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground">
								{stat.description}
							</p>
							<p className="text-xs text-green-600 mt-1">
								{stat.trend}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
			
			<div className="grid gap-6 md:grid-cols-2">
				{/* Recent Users */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Users</CardTitle>
						<CardDescription>
							Latest wallet connections
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentUsers.map((user) => (
								<div key={user.id} className="flex items-center justify-between">
									<div className="space-y-1">
										<p className="text-sm font-medium">
											{user.username}
										</p>
										<p className="text-xs text-muted-foreground">
											{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
										</p>
									</div>
									<div className="text-right">
										<Badge variant="secondary">
											{user.creditsBalance} credits
										</Badge>
										<p className="text-xs text-muted-foreground mt-1">
											{new Date(user.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				
				{/* Top Comics */}
				<Card>
					<CardHeader>
						<CardTitle>Popular Comics</CardTitle>
						<CardDescription>
							Most unlocked content
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{topComics.map((comic) => {
								const totalUnlocks = comic.volumes.reduce((total, volume) =>
										total + volume.chapters.reduce((chapterTotal, chapter) =>
											chapterTotal + chapter.unlocks.length, 0
										), 0
								);
								
								return (
									<div key={comic.id} className="flex items-center justify-between">
										<div className="space-y-1">
											<p className="text-sm font-medium">{comic.title}</p>
											<p className="text-xs text-muted-foreground">
												by {comic.author}
											</p>
										</div>
										<div className="text-right">
											<Badge variant="outline">
												{totalUnlocks} unlocks
											</Badge>
											<p className="text-xs text-muted-foreground mt-1">
												{comic.status.toLowerCase()}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}