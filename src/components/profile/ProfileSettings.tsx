"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import {
	Settings,
	LogOut,
	Shield,
	Bell,
	Eye,
	Moon,
	Sun,
	Download,
	Trash2,
	ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface User {
	id: string;
	walletAddress: string;
	username?: string | null;
	creditsBalance: number;
	role: "USER" | "ADMIN";
	createdAt: Date;
}

interface ProfileSettingsProps {
	user: User;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("dark");
	const [notifications, setNotifications] = useState(true);
	const [privacy, setPrivacy] = useState<"public" | "private">("private");
	const router = useRouter();
	
	const handleSignOut = async () => {
		setIsLoading(true);
		try {
			await signOut({ redirect: false });
			router.push("/");
			toast.success("Signed out successfully");
		} catch (error) {
			toast.error("Failed to sign out");
		} finally {
			setIsLoading(false);
		}
	};
	
	const handleExportData = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/user/export", {
				method: "GET",
			});
			
			if (!response.ok) {
				throw new Error("Failed to export data");
			}
			
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `comic-platform-data-${user.id}.json`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			
			toast.success("Data exported successfully");
		} catch (error) {
			toast.error("Failed to export data");
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<div className="space-y-8">
			{/* Enhanced Account Settings */}
			<GlowCard variant="gradient_basic" shimmer className="relative overflow-hidden">
				<div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl"></div>
				<div className="relative p-6">
					<div className="flex items-center gap-3 mb-6">
						<AnimatedBadge
							variant="info"
							size="lg"
							animation="glow"
							icon={<Settings className="h-5 w-5" />}
						>
							Account Settings
						</AnimatedBadge>
					</div>
					
					<div className="space-y-5">
						{/* Role Badge */}
						<div className="flex items-center justify-between py-3 border-b border-white/10">
							<span className="text-gray-800 font-medium">Account Type</span>
							<AnimatedBadge
								variant={user.role === "ADMIN" ? "accent" : "info"}
								size="lg"
								animation={user.role === "ADMIN" ? "glow" : "none"}
								icon={user.role === "ADMIN" ? <Shield className="h-4 w-4" /> : undefined}
							>
								{user.role === "ADMIN" ? "Administrator" : "Standard User"}
							</AnimatedBadge>
						</div>
						
						{/* Wallet Connection */}
						<div className="flex items-center justify-between py-3 border-b border-white/10">
							<span className="text-gray-800 font-medium">Wallet Status</span>
							<AnimatedBadge
								variant="success"
								size="lg"
								animation="pulse"
								icon={<Shield className="h-4 w-4" />}
							>
								Connected
							</AnimatedBadge>
						</div>
						
						{/* Member Since */}
						<div className="flex items-center justify-between py-3">
							<span className="text-gray-800 font-medium">Member Since</span>
							<AnimatedBadge variant="glass" size="lg">
								{new Date(user.createdAt).toLocaleDateString()}
							</AnimatedBadge>
						</div>
					</div>
				</div>
			</GlowCard>
			
			{/* Enhanced Preferences */}
			<GlowCard variant="gradient_basic" className="relative overflow-hidden">
				<div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-2xl"></div>
				<div className="relative p-6">
					<div className="flex items-center gap-3 mb-6">
						<AnimatedBadge
							variant="info"
							size="lg"
							icon={<Eye className="h-5 w-5" />}
						>
							Preferences
						</AnimatedBadge>
					</div>
					
					<div className="space-y-6">
						{/* Theme Toggle */}
						<div className="flex items-center justify-between py-3 border-b border-white/10">
							<span className="text-gray-800 font-medium">Theme</span>
							<div className="flex gap-2">
								<GradientButton
									size="sm"
									variant={theme === "dark" ? "primary" : "ghost"}
									onClick={() => setTheme("dark")}
									icon={<Moon className="h-4 w-4" />}
								>
									Dark
								</GradientButton>
								<GradientButton
									size="sm"
									variant="ghost"
									disabled
									icon={<Sun className="h-4 w-4" />}
									className="opacity-50"
								>
									Light
								</GradientButton>
							</div>
						</div>
						
						{/* Notifications Toggle */}
						<div className="flex items-center justify-between py-3 border-b border-white/10">
							<span className="text-gray-800 font-medium">Notifications</span>
							<GradientButton
								size="sm"
								variant={notifications ? "accent" : "outline"}
								onClick={() => setNotifications(!notifications)}
								icon={<Bell className="h-4 w-4" />}
							>
								{notifications ? "Enabled" : "Disabled"}
							</GradientButton>
						</div>
						
						{/* Privacy Toggle */}
						<div className="flex items-center justify-between py-3">
							<span className="text-gray-800 font-medium">Profile Visibility</span>
							<GradientButton
								size="sm"
								variant={privacy === "private" ? "secondary" : "accent"}
								onClick={() => setPrivacy(privacy === "public" ? "private" : "public")}
								icon={<Eye className="h-4 w-4" />}
							>
								{privacy === "private" ? "Private" : "Public"}
							</GradientButton>
						</div>
					</div>
				</div>
			</GlowCard>
			
			{/* Enhanced Quick Actions */}
			<GlowCard variant="gradient_basic" className="relative overflow-hidden">
				<div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl"></div>
				<div className="relative p-6">
					<div className="flex items-center gap-3 mb-6">
						<AnimatedBadge
							variant="info"
							size="lg"
							icon={<ExternalLink className="h-5 w-5" />}
						>
							Quick Actions
						</AnimatedBadge>
					</div>
					
					<div className="space-y-4">
						<GradientButton
							variant="info"
							size="lg"
							icon={<ExternalLink className="h-5 w-5" />}
							className="w-full justify-start"
							asChild
						>
							<a href="/library">
								View Library
							</a>
						</GradientButton>
						
						<GradientButton
							variant="secondary"
							size="lg"
							icon={<ExternalLink className="h-5 w-5" />}
							className="w-full justify-start"
							asChild
						>
							<a href="/history">
								Reading History
							</a>
						</GradientButton>
						
						<GradientButton
							variant="outline"
							size="lg"
							icon={<Download className="h-5 w-5" />}
							onClick={handleExportData}
							disabled={isLoading}
							className="w-full justify-start"
						>
							{isLoading ? "Exporting..." : "Export Data"}
						</GradientButton>
						
						{user.role === "ADMIN" && (
							<GradientButton
								variant="gradient"
								size="lg"
								icon={<Shield className="h-5 w-5" />}
								className="w-full justify-start"
								asChild
							>
								<a href="/admin">
									Admin Dashboard
								</a>
							</GradientButton>
						)}
					</div>
				</div>
			</GlowCard>
			
			{/* Enhanced Help & Support */}
			<GlowCard variant="gradient_basic" className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-primary/5"></div>
				<div className="relative p-6 text-center">
					<AnimatedBadge
						variant="glass"
						size="lg"
						className="mb-4"
					>
						Need Help?
					</AnimatedBadge>
					
					<div className="space-y-3">
						<GradientButton
							variant="ghost"
							size="sm"
							className="w-full text-blue-400 hover:text-blue-300"
							asChild
						>
							<a href="mailto:support@comicplatform.com">
								Contact Support
							</a>
						</GradientButton>
						<GradientButton
							variant="ghost"
							size="sm"
							className="w-full text-blue-400 hover:text-blue-300"
							asChild
						>
							<a href="/docs">
								Documentation
							</a>
						</GradientButton>
					</div>
				</div>
			</GlowCard>
		</div>
	);
}