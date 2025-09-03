"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import {
	ArrowUp,
	ArrowDown,
	Clock,
	ExternalLink,
	CreditCard,
	BookOpen,
	TrendingUp,
	Award,
	Zap,
	Calendar,
	Filter,
	Download
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface Transaction {
	id: string;
	type: "PURCHASE" | "SPEND" | "REFUND" | "ADMIN_ADJUSTMENT";
	amount: number;
	description: string;
	createdAt: Date;
	transactionHash?: string | null;
}

interface TransactionHistoryProps {
	transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
	const formatAmount = (amount: number, type: "PURCHASE" | "SPEND" | "REFUND" | "ADMIN_ADJUSTMENT") => {
		// PURCHASE amounts are positive, SPEND amounts are negative in the database
		const displayAmount = Math.abs(amount);
		const sign = type === "PURCHASE" || type === "REFUND" || (type === "ADMIN_ADJUSTMENT" && amount > 0) ? "+" : "-";
		return `${sign}${displayAmount.toLocaleString()}`;
	};
	
	const getTransactionIcon = (type: "PURCHASE" | "SPEND" | "REFUND" | "ADMIN_ADJUSTMENT", description: string) => {
		if (type === "PURCHASE" || type === "REFUND" || (type === "ADMIN_ADJUSTMENT" && description.includes("credit"))) {
			return <ArrowUp className="h-4 w-4 text-green-500" />;
		} else if (type === "SPEND") {
			if (description.toLowerCase().includes("unlock")) {
				return <BookOpen className="h-4 w-4 text-blue-500" />;
			}
			return <ArrowDown className="h-4 w-4 text-red-500" />;
		} else {
			return <ArrowDown className="h-4 w-4 text-orange-500" />; // Admin adjustment debit
		}
	};
	
	const getTransactionColor = (type: "PURCHASE" | "SPEND" | "REFUND" | "ADMIN_ADJUSTMENT") => {
		if (type === "PURCHASE" || type === "REFUND") {
			return "text-green-500";
		} else if (type === "SPEND") {
			return "text-red-500";
		} else {
			return "text-orange-500"; // Admin adjustments
		}
	};
	
	const getTransactionBackground = (type: "PURCHASE" | "SPEND" | "REFUND" | "ADMIN_ADJUSTMENT") => {
		if (type === "PURCHASE" || type === "REFUND") {
			return "bg-green-500/5 border-green-500/20 hover:bg-green-500/10";
		} else if (type === "SPEND") {
			return "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10";
		} else {
			return "bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10";
		}
	};
	
	// Calculate spending analytics
	const totalSpent = transactions
		.filter(t => t.type === "SPEND")
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);
	
	const totalEarned = transactions
		.filter(t => t.type === "PURCHASE" || t.type === "REFUND")
		.reduce((sum, t) => sum + t.amount, 0);
	
	const chaptersUnlocked = transactions
		.filter(t => t.type === "SPEND" && t.description.toLowerCase().includes("unlock"))
		.length;
	
	return (
		<div className="space-y-6">
			{/* Analytics Overview */}
			<Card className="bg-card/80 backdrop-blur-sm border border-border/50">
				<CardHeader>
					<CardTitle className="text-foreground flex items-center gap-2 text-lg">
						<TrendingUp className="h-5 w-5" />
						Activity Overview
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center p-4 bg-green-500/5 rounded-xl border border-green-500/20">
							<div className="text-2xl font-bold text-green-500 mb-1">
								{totalEarned.toLocaleString()}
							</div>
							<div className="text-xs text-muted-foreground">Credits Earned</div>
						</div>
						<div className="text-center p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
							<div className="text-2xl font-bold text-blue-500 mb-1">
								{chaptersUnlocked}
							</div>
							<div className="text-xs text-muted-foreground">Chapters Unlocked</div>
						</div>
					</div>
					
					{/* Spending Progress */}
					{totalEarned > 0 && (
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium">Credits Used</span>
								<span className="text-xs text-muted-foreground">
                  {Math.round((totalSpent / totalEarned) * 100)}%
                </span>
							</div>
							<Progress value={(totalSpent / totalEarned) * 100} className="h-2" />
							<div className="text-xs text-muted-foreground mt-1">
								{(totalEarned - totalSpent).toLocaleString()} remaining
							</div>
						</div>
					)}
				</CardContent>
			</Card>
			
			{/* Transaction Timeline */}
			<Card className="bg-card/80 backdrop-blur-sm border border-border/50">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-foreground flex items-center gap-2 text-lg">
							<Clock className="h-5 w-5" />
							Transaction History
						</CardTitle>
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm">
								<Filter className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="sm">
								<Download className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{transactions.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-20 h-20 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center">
								<CreditCard className="h-10 w-10 text-muted-foreground/50" />
							</div>
							<h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
							<p className="text-muted-foreground text-sm max-w-sm mx-auto">
								Your credit activity will appear here once you make your first purchase or unlock content
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{/* Timeline Container */}
							<div className="relative">
								{/* Timeline Line */}
								<div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/20 to-transparent" />
								
								{transactions.map((transaction, index) => (
									<div
										key={transaction.id}
										className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${getTransactionBackground(transaction.type)}`}
									>
										{/* Timeline Dot */}
										<div className="relative z-10 flex-shrink-0">
											<div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
												transaction.type === "PURCHASE" || transaction.type === "REFUND"
													? "bg-green-500/10 border-green-500/30"
													: transaction.type === "SPEND"
														? "bg-blue-500/10 border-blue-500/30"
														: "bg-orange-500/10 border-orange-500/30"
											}`}>
												{getTransactionIcon(transaction.type, transaction.description)}
											</div>
										</div>
										
										{/* Transaction Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="font-medium text-foreground mb-1">
														{transaction.description}
													</div>
													<div className="flex items-center gap-3 text-sm text-muted-foreground">
														<div className="flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{format(new Date(transaction.createdAt), "MMM d, yyyy 'at' h:mm a")}
														</div>
														<div className="flex items-center gap-1">
															<Clock className="h-3 w-3" />
															{formatDistanceToNow(new Date(transaction.createdAt), {
																addSuffix: true,
															})}
														</div>
													</div>
													
													{/* Transaction Hash */}
													{transaction.transactionHash && (
														<div className="mt-2">
															<Button
																variant="ghost"
																size="sm"
																className="h-auto p-0 text-primary hover:text-primary/80"
																asChild
															>
																<a
																	href={`https://etherscan.io/tx/${transaction.transactionHash}`}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="flex items-center gap-2 text-xs"
																>
																	<ExternalLink className="h-3 w-3" />
																	View on Etherscan
																</a>
															</Button>
														</div>
													)}
												</div>
												
												{/* Amount Display */}
												<div className="text-right">
													<div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
														{formatAmount(transaction.amount, transaction.type)}
													</div>
													<div className="text-xs text-muted-foreground">credits</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
							
							{/* View More Button */}
							<div className="text-center pt-4 border-t border-border/30">
								<Button
									variant="ghost"
									size="sm"
									className="text-muted-foreground hover:text-foreground"
								>
									View All Transactions ({transactions.length})
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
			
			{/* Quick Actions */}
			<Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
				<CardContent className="p-6">
					<div className="flex items-center gap-3 mb-4">
						<Award className="h-5 w-5 text-primary" />
						<h3 className="font-semibold text-foreground">Credit Management Tips</h3>
					</div>
					<div className="grid grid-cols-1 gap-3 text-sm">
						<div className="flex items-center gap-2">
							<Zap className="h-3 w-3 text-yellow-500" />
							<span className="text-muted-foreground">Credits never expire - use them anytime</span>
						</div>
						<div className="flex items-center gap-2">
							<BookOpen className="h-3 w-3 text-blue-500" />
							<span className="text-muted-foreground">Unlock chapters permanently</span>
						</div>
						<div className="flex items-center gap-2">
							<TrendingUp className="h-3 w-3 text-green-500" />
							<span className="text-muted-foreground">Track all activity on blockchain</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}