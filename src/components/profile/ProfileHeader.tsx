"use client";

import { useState } from "react";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { Input } from "@/components/ui/input";
import {
	Wallet,
	Edit3,
	Check,
	X,
	Copy,
	Crown,
	Calendar,
	CreditCard,
	Clock
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface User {
	id: string;
	walletAddress: string;
	username?: string | null;
	creditsBalance: number;
	role: "USER" | "ADMIN";
	createdAt: Date;
	updatedAt: Date;
}

interface ProfileHeaderProps {
	user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
	const [isEditingUsername, setIsEditingUsername] = useState(false);
	const [newUsername, setNewUsername] = useState(user.username || "");
	const [isUpdating, setIsUpdating] = useState(false);
	
	const handleCopyAddress = async () => {
		try {
			await navigator.clipboard.writeText(user.walletAddress);
			toast.success("Wallet address copied!");
		} catch (error) {
			toast.error("Failed to copy address");
		}
	};
	
	const handleUpdateUsername = async () => {
		if (!newUsername.trim()) {
			toast.error("Username cannot be empty");
			return;
		}
		
		setIsUpdating(true);
		try {
			const response = await fetch("/api/user/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: newUsername.trim() }),
			});
			
			if (!response.ok) {
				throw new Error("Failed to update username");
			}
			
			toast.success("Username updated successfully!");
			setIsEditingUsername(false);
			// Refresh the page to show updated data
			window.location.reload();
		} catch (error) {
			toast.error("Failed to update username");
		} finally {
			setIsUpdating(false);
		}
	};
	
	const handleCancelEdit = () => {
		setNewUsername(user.username || "");
		setIsEditingUsername(false);
	};
	
	const formatAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};
	
	return (
		<GlowCard variant="basic" shimmer className="overflow-hidden relative">
			{/* Dynamic Hero Background */}
			<div className="h-40 bg-gradient-hero relative overflow-hidden rounded-md">
				<div className="absolute inset-0 bg-gray-100" />
			</div>
			
			<div className="relative -mt-20 p-8">
				<div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
					{/* Enhanced Avatar */}
					<div className="relative flex-shrink-0">
						<div className="w-32 h-32 rounded-full bg-gradient-hero flex items-center justify-center text-white text-3xl font-bold glow-pulse shadow-2xl border-4 border-white/30 relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-full"></div>
							<span className="relative z-10">
								{(user.username || user.walletAddress).charAt(0).toUpperCase()}
							</span>
						</div>
						{/* Animated gradient ring */}
						<div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-secondary to-primary animate-spin opacity-20" style={{animationDuration: '8s'}}></div>
						
						{user.role === "ADMIN" && (
							<div className="absolute -top-3 -right-3">
								<AnimatedBadge
									variant="gradient"
									size="lg"
									animation="glow"
									icon={<Crown className="h-4 w-4" />}
								>
									Admin
								</AnimatedBadge>
							</div>
						)}
						
						{/* Level indicator */}
						<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
							<AnimatedBadge variant="neon" size="sm" animation="pulse">
								Level 5
							</AnimatedBadge>
						</div>
					</div>
					
					{/* Enhanced User Info */}
					<div className="flex-1 space-y-6">
						{/* Username with gradient text */}
						<div className="space-y-3">
							{isEditingUsername ? (
								<div className="flex items-center gap-3 max-w-lg">
									<Input
										value={newUsername}
										onChange={(e) => setNewUsername(e.target.value)}
										placeholder="Enter username"
										className="bg-white/10 border-primary/30 text-white placeholder:text-white/50 focus:border-primary/60 focus:ring-primary/30"
										disabled={isUpdating}
										autoFocus
									/>
									<GradientButton
										size="sm"
										variant="accent"
										onClick={handleUpdateUsername}
										disabled={isUpdating || !newUsername.trim()}
										icon={isUpdating ? undefined : <Check className="h-4 w-4" />}
									>
										{isUpdating ? "Saving..." : "Save"}
									</GradientButton>
									<GradientButton
										size="sm"
										variant="ghost"
										onClick={handleCancelEdit}
										disabled={isUpdating}
										icon={<X className="h-4 w-4" />}
									>
										Cancel
									</GradientButton>
								</div>
							) : (
								<div className="flex items-center gap-4 flex-wrap">
									<h1 className="text-3xl md:text-4xl font-display font-bold text-gradient bg-gradient-hero leading-tight">
										{user.username || "Anonymous User"}
									</h1>
									<GradientButton
										size="sm"
										variant="outline"
										onClick={() => setIsEditingUsername(true)}
										icon={<Edit3 className="h-4 w-4" />}
									>
										Edit
									</GradientButton>
								</div>
							)}
						</div>
						
						{/* Wallet Address with enhanced design */}
						<div className="flex items-center gap-3 flex-wrap">
							<AnimatedBadge
								variant="neon"
								size="lg"
								icon={<Wallet className="h-4 w-4" />}
								animation="glow"
							>
								{formatAddress(user.walletAddress)}
							</AnimatedBadge>
							<GradientButton
								size="sm"
								variant="outline"
								onClick={handleCopyAddress}
								icon={<Copy className="h-4 w-4" />}
							>
								Copy
							</GradientButton>
						</div>
						
						{/* Enhanced User Stats */}
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="text-center">
								<AnimatedBadge
									variant="gradient"
									size="lg"
									animation="glow"
									icon={<CreditCard className="h-5 w-5" />}
								>
									{user.creditsBalance.toLocaleString()} Credits
								</AnimatedBadge>
							</div>
							
							<div className="text-center">
								<AnimatedBadge
									variant={user.role === "ADMIN" ? "gradient" : "success"}
									size="lg"
									animation={user.role === "ADMIN" ? "float" : "pulse"}
									icon={user.role === "ADMIN" ? <Crown className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
								>
									{user.role === "ADMIN" ? "Admin" : "Active"}
								</AnimatedBadge>
							</div>
							
							<div className="text-center">
								<AnimatedBadge
									variant="info"
									size="lg"
									animation="none"
									icon={<Calendar className="h-5 w-5" />}
								>
									<span className="text-xs">{formatDistanceToNow(new Date(user.createdAt))} ago</span>
								</AnimatedBadge>
							</div>
							
							<div className="text-center">
								<AnimatedBadge
									variant="glass"
									size="lg"
									animation="pulse"
									icon={<Clock className="h-5 w-5" />}
								>
									<span className="text-xs">{formatDistanceToNow(new Date(user.updatedAt))} ago</span>
								</AnimatedBadge>
							</div>
						</div>
					</div>
					
					{/* Enhanced Action Buttons */}
					<div className="flex flex-col gap-4 lg:items-end">
						<GradientButton
							variant="primary"
							size="lg"
							icon={<CreditCard className="h-5 w-5" />}
							asChild
						>
							<a href="/credits">
								Buy Credits
							</a>
						</GradientButton>
						<GradientButton
							variant="accent"
							size="lg"
							icon={<Calendar className="h-5 w-5" />}
							asChild
						>
							<a href="/library">
								My Library
							</a>
						</GradientButton>
					</div>
				</div>
			</div>
		</GlowCard>
	);
}