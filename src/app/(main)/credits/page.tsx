import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { CreditPurchase } from "@/components/credits/CreditPurchase";
import { TransactionHistory } from "@/components/credits/TransactionHistory";
import { CreditBalance } from "@/components/credits/CreditBalance";
import { ActivityFeed } from "@/components/credits/ActivityFeed";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { FloatingElements, GeometricPattern } from "@/components/ui/floating-elements";
import { Sparkles, Zap, TrendingUp, Users, Star, Shield, Coins } from "lucide-react";

export default async function CreditsPage() {
	const session = await getServerSession(authOptions);
	
	if (!session) {
		redirect("/connect-wallet");
	}
	
	// Fetch user's current balance and recent transactions
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			creditsBalance: true,
			walletAddress: true,
		},
	});
	
	// Fetch recent credit transactions and platform statistics
	const [recentTransactions, totalPurchasesToday, totalUsers] = await Promise.all([
		prisma.transaction.findMany({
			where: {
				userId: session.user.id,
				status: "CONFIRMED", // Only show confirmed transactions
			},
			orderBy: { createdAt: "desc" },
			take: 10,
		}),
		prisma.transaction.count({
			where: {
				type: "PURCHASE",
				createdAt: {
					gte: new Date(new Date().setHours(0, 0, 0, 0)),
				},
			},
		}),
		prisma.user.count(), // Total registered users
	]);

	// Calculate estimated active users (mock calculation based on total users and recent activity)
	const activeUsers = Math.floor(totalUsers * 0.15) + Math.floor(Math.random() * 50) + 100;
	
	if (!user) {
		redirect("/connect-wallet");
	}
	
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
			{/* Hero Section */}
			<section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
				{/* Background Elements */}
				<div className="absolute inset-0 animated-gradient opacity-20" />
				<FloatingElements count={25} variant="geometric" animated />
				<GeometricPattern />
				
				{/* Floating Credit Cards */}
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute top-1/4 left-1/4 w-20 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg opacity-20 animate-bounce" style={{animationDelay: '0s'}} />
					<div className="absolute top-1/3 right-1/4 w-16 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg opacity-30 animate-bounce" style={{animationDelay: '2s'}} />
					<div className="absolute bottom-1/3 left-1/3 w-24 h-14 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg opacity-25 animate-bounce" style={{animationDelay: '1s'}} />
				</div>
				
				{/* Main Hero Content */}
				<div className="relative z-10 container mx-auto px-4 text-center">
					<div className="max-w-6xl mx-auto">
						{/* Hero Badge */}
						<div className="flex justify-center mb-8">
							<AnimatedBadge
								variant="gradient"
								size="lg"
								animation="glow"
								icon={<Coins className="h-4 w-4" />}
							>
								Power Up Your Reading
							</AnimatedBadge>
						</div>
						
						{/* Hero Title */}
						<h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-6 leading-tight">
							<span className="text-gradient bg-gradient-hero">
								Unlock
							</span>
							<br />
							<span className="text-foreground">
								Unlimited Stories
							</span>
						</h1>
						
						{/* Hero Subtitle */}
						<p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
							Join thousands of readers who never wait for the next chapter.
							Credits unlock premium content instantly and never expire.
						</p>
						
						{/* Platform Statistics */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
							<div className="text-center">
								<AnimatedBadge
									variant="neon"
									size="xl"
									animation="pulse"
									icon={<Zap className="h-5 w-5" />}
								>
									{totalPurchasesToday.toLocaleString()} Purchases Today
								</AnimatedBadge>
							</div>
							<div className="text-center">
								<AnimatedBadge
									variant="glass"
									size="xl"
									animation="float"
									icon={<Users className="h-5 w-5" />}
								>
									{activeUsers.toLocaleString()}+ Active Readers
								</AnimatedBadge>
							</div>
							<div className="text-center">
								<AnimatedBadge
									variant="success"
									size="xl"
									icon={<Shield className="h-5 w-5" />}
								>
									100% Secure Blockchain
								</AnimatedBadge>
							</div>
						</div>
					</div>
				</div>
				
				{/* Scroll Indicator */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
					<div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
						<div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
					</div>
				</div>
			</section>
			
			{/* Main Content */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					{/* Enhanced Balance Display */}
					<div className="mb-16">
						<CreditBalance user={user} />
					</div>
					
					<div className="grid lg:grid-cols-4 gap-8">
						{/* Credit Packages - Takes more space */}
						<div className="lg:col-span-3">
							<CreditPurchase userId={user.id} />
						</div>
						
						{/* Sidebar with Activity and History */}
						<div className="lg:col-span-1 space-y-8">
							{/* Live Activity Feed */}
							<ActivityFeed />
							
							{/* Transaction History */}
							<TransactionHistory transactions={recentTransactions} />
						</div>
					</div>
					
					{/* Social Proof Section */}
					<div className="mt-24">
						<div className="text-center mb-16">
							<AnimatedBadge
								variant="gradient"
								size="lg"
								icon={<Star className="h-4 w-4" />}
								className="mb-6"
							>
								Trusted by Readers Worldwide
							</AnimatedBadge>
							<h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-gradient">
								Join the Community
							</h2>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								See what other readers are saying about premium content access
							</p>
						</div>
						
						{/* Trust Indicators */}
						<div className="grid md:grid-cols-3 gap-8">
							<div className="text-center p-6 bg-card/50 rounded-2xl border border-border/50">
								<div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
									<Shield className="h-8 w-8 text-green-500" />
								</div>
								<h3 className="text-xl font-bold mb-2">Secure Payments</h3>
								<p className="text-muted-foreground text-sm">
									All transactions verified on-chain with smart contract security
								</p>
							</div>
							<div className="text-center p-6 bg-card/50 rounded-2xl border border-border/50">
								<div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
									<Zap className="h-8 w-8 text-blue-500" />
								</div>
								<h3 className="text-xl font-bold mb-2">Instant Access</h3>
								<p className="text-muted-foreground text-sm">
									Unlock chapters immediately after purchase confirmation
								</p>
							</div>
							<div className="text-center p-6 bg-card/50 rounded-2xl border border-border/50">
								<div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
									<Star className="h-8 w-8 text-purple-500" />
								</div>
								<h3 className="text-xl font-bold mb-2">Premium Content</h3>
								<p className="text-muted-foreground text-sm">
									Access exclusive chapters and support your favorite creators
								</p>
							</div>
						</div>
					</div>
					
					{/* CTA Section */}
					<div className="mt-24 text-center">
						<div className="bg-gradient-hero rounded-3xl p-12 relative overflow-hidden">
							<FloatingElements count={10} variant="subtle" />
							<div className="relative z-10">
								<h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
									Ready to Unlock Everything?
								</h2>
								<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
									Start with our popular package and never wait for your favorite stories again
								</p>
								<GradientButton
									variant="outline"
									size="xl"
									className="bg-white text-primary hover:bg-white/90"
									icon={<Sparkles className="h-5 w-5" />}
								>
									Get Started Now
								</GradientButton>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}