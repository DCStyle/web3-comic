"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GradientButton } from "@/components/ui/gradient-button";
import {
	MessageSquare,
	Users,
	TrendingUp,
	Clock,
	Star,
	Flame,
	Eye,
	Heart,
	RefreshCw,
	ExternalLink
} from "lucide-react";

interface CommentsSectionProps {
	comicSlug: string;
	comicTitle: string;
	baseUrl?: string;
	width?: number;
	numPosts?: number;
	colorScheme?: "light" | "dark";
	loading?: boolean;
}

declare global {
	interface Window {
		FB: any;
		fbAsyncInit: () => void;
	}
}

export function CommentsSection({
	                                comicSlug,
	                                comicTitle,
	                                baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://web3-comic.vercel.app",
	                                width,
	                                numPosts = 10,
	                                colorScheme = "dark",
	                                loading = false
                                }: CommentsSectionProps) {
	const commentsRef = useRef<HTMLDivElement>(null);
	const [fbLoaded, setFbLoaded] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [commentStats, setCommentStats] = useState({
		count: 0,
		trending: false,
		engagement: 0
	});
	
	const commentUrl = `${baseUrl}/comics/${comicSlug}`;
	
	// Mock comment stats (in production, you'd get this from Facebook Graph API)
	useEffect(() => {
		const mockStats = {
			count: Math.floor(Math.random() * 150) + 10,
			trending: Math.random() > 0.7,
			engagement: Math.floor(Math.random() * 100) + 20
		};
		setCommentStats(mockStats);
	}, [comicSlug]);
	
	// Initialize Facebook SDK
	useEffect(() => {
		const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
		if (!appId) {
			console.warn("Facebook App ID not configured");
			return;
		}
		
		// Load Facebook SDK
		if (!window.FB) {
			window.fbAsyncInit = function() {
				window.FB.init({
					appId: appId,
					cookie: true,
					xfbml: true,
					version: 'v18.0'
				});
				setFbLoaded(true);
			};
			
			// Load the SDK asynchronously
			const script = document.createElement('script');
			script.id = 'facebook-jssdk';
			script.src = 'https://connect.facebook.net/en_US/sdk.js';
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		} else {
			setFbLoaded(true);
		}
		
		return () => {
			// Cleanup script if component unmounts
			const existingScript = document.getElementById('facebook-jssdk');
			if (existingScript) {
				existingScript.remove();
			}
		};
	}, []);
	
	// Parse Facebook comments when SDK is loaded
	useEffect(() => {
		if (fbLoaded && window.FB && commentsRef.current) {
			window.FB.XFBML.parse(commentsRef.current);
		}
	}, [fbLoaded, comicSlug]);
	
	const handleRefresh = async () => {
		setIsRefreshing(true);
		
		if (window.FB && commentsRef.current) {
			// Re-parse the comments
			window.FB.XFBML.parse(commentsRef.current);
		}
		
		// Simulate refresh delay
		setTimeout(() => {
			setIsRefreshing(false);
		}, 1000);
	};
	
	if (loading) {
		return (
			<section className="py-16">
				<div className="container mx-auto px-4">
					<Card className="bg-gray-100 backdrop-blur-sm border-gray-200">
						<CardHeader>
							<div className="animate-pulse space-y-4">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gray-200 rounded-lg" />
									<div className="w-40 h-6 bg-gray-200 rounded" />
								</div>
								<div className="flex gap-4">
									<div className="w-20 h-6 bg-gray-200 rounded" />
									<div className="w-16 h-6 bg-gray-200 rounded" />
									<div className="w-24 h-6 bg-gray-200 rounded" />
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className="animate-pulse">
										<div className="flex gap-3 mb-3">
											<div className="w-8 h-8 bg-gray-200 rounded-full" />
											<div className="flex-1">
												<div className="w-24 h-4 bg-gray-200 rounded mb-2" />
												<div className="w-full h-16 bg-gray-200 rounded" />
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		);
	}
	
	return (
		<section className="space-y-4">
			<Card className="bg-gray-100 backdrop-blur-sm border-gray-200 overflow-hidden">
				{/* Header */}
				<CardHeader className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-gray-100">
					<div className="flex items-center justify-between">
						<CardTitle className="text-white flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
								<MessageSquare className="h-5 w-5 text-white" />
							</div>
							<div>
								<h2 className="text-2xl font-bold">Discussion</h2>
								<p className="text-gray-700 text-sm font-normal">
									Join the conversation about "{comicTitle}"
								</p>
							</div>
						</CardTitle>
						
						<div className="flex items-center gap-3">
							<GradientButton
								variant="ghost"
								size="sm"
								onClick={handleRefresh}
								disabled={isRefreshing}
								icon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
								className="text-gray-800 hover:bg-gray-100"
							>
								{isRefreshing ? 'Refreshing' : 'Refresh'}
							</GradientButton>
						</div>
					</div>
					
					{/* Comment Statistics */}
					<div className="flex flex-wrap gap-3 mt-4">
						<AnimatedBadge
							variant="info"
							size="lg"
							icon={<Users className="h-4 w-4" />}
							animation={commentStats.count > 50 ? "glow" : "none"}
						>
							{commentStats.count} comments
						</AnimatedBadge>
						
						{commentStats.trending && (
							<AnimatedBadge
								variant="warning"
								size="lg"
								icon={<Flame className="h-4 w-4" />}
								animation="pulse"
							>
								Trending Discussion
							</AnimatedBadge>
						)}
						
						<AnimatedBadge
							variant="success"
							size="lg"
							icon={<TrendingUp className="h-4 w-4" />}
						>
							{commentStats.engagement}% engaged
						</AnimatedBadge>
						
						<AnimatedBadge
							variant="glass"
							size="lg"
							icon={<Star className="h-4 w-4" />}
						>
							Community Favorite
						</AnimatedBadge>
					</div>
				</CardHeader>
				
				<CardContent className="p-0">
					{/* Engagement Prompt */}
					<div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-100">
						<div className="text-center space-y-3">
							<div className="flex items-center justify-center gap-2">
								<Heart className="h-5 w-5 text-pink-600" />
								<span className="text-gray-800 font-medium">
                    What did you think of this comic?
                  </span>
								<Heart className="h-5 w-5 text-pink-600" />
							</div>
							<p className="text-gray-700 text-sm max-w-2xl mx-auto">
								Share your thoughts, theories, and favorite moments with fellow readers.
								Your insights help build our amazing comic community!
							</p>
						</div>
					</div>
					
					{/* Facebook Comments */}
					<div className="p-6">
						{!fbLoaded ? (
							<div className="text-center py-12">
								<div className="inline-flex items-center gap-2 text-gray-400">
									<RefreshCw className="h-5 w-5 animate-spin" />
									<span>Loading comments...</span>
								</div>
							</div>
						) : (
							<div ref={commentsRef} className="fb-comments-container">
								<div
									className="fb-comments"
									data-href={commentUrl}
									data-width={width || "100%"}
									data-numposts={numPosts}
									data-colorscheme={colorScheme}
									data-order-by="social"
									data-mobile="true"
								/>
							</div>
						)}
					</div>
					
					{/* Community Guidelines */}
					<div className="p-6 bg-gray-50 border-t border-gray-100">
						<div className="text-center">
							<h3 className="text-white font-medium mb-2 flex items-center justify-center gap-2">
								<Users className="h-4 w-4" />
								Community Guidelines
							</h3>
							<div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
								<span>• Be respectful to other readers</span>
								<span>• No spoilers without warnings</span>
								<span>• Stay on topic</span>
								<span>• Have fun discussing!</span>
							</div>
							
							<div className="mt-4 flex justify-center gap-3">
								<GradientButton
									variant="outline"
									size="sm"
									className="border-gray-300 text-gray-800 hover:bg-gray-100"
									icon={<ExternalLink className="h-3 w-3" />}
								>
									Full Guidelines
								</GradientButton>
								
								<GradientButton
									variant="outline"
									size="sm"
									className="border-gray-300 text-gray-800 hover:bg-gray-100"
									icon={<Eye className="h-3 w-3" />}
								>
									Report Issue
								</GradientButton>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			
			{/* Discussion Highlights */}
			<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="bg-gray-50 backdrop-blur-sm border-gray-100 hover:bg-gray-100 transition-colors">
					<CardContent className="p-4 text-center">
						<MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{commentStats.count}
						</div>
						<div className="text-gray-600 text-sm">Total Comments</div>
					</CardContent>
				</Card>
				
				<Card className="bg-gray-50 backdrop-blur-sm border-gray-100 hover:bg-gray-100 transition-colors">
					<CardContent className="p-4 text-center">
						<TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{commentStats.engagement}%
						</div>
						<div className="text-gray-600 text-sm">Engagement Rate</div>
					</CardContent>
				</Card>
				
				<Card className="bg-gray-50 backdrop-blur-sm border-gray-100 hover:bg-gray-100 transition-colors">
					<CardContent className="p-4 text-center">
						<Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{Math.floor(commentStats.count * 0.7)}
						</div>
						<div className="text-gray-600 text-sm">Active Discussants</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}