"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { GlowCard } from "@/components/ui/glow-card";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, Sparkles, Clock, CheckCircle, Pause, ExternalLink } from "lucide-react";

const GENRES = [
	{ name: "Action", color: "comic-orange" },
	{ name: "Adventure", color: "comic-blue" },
	{ name: "Comedy", color: "comic-yellow" },
	{ name: "Drama", color: "comic-purple" },
	{ name: "Fantasy", color: "comic-pink" },
	{ name: "Horror", color: "destructive" },
	{ name: "Romance", color: "comic-pink" },
	{ name: "Sci-Fi", color: "neon-blue" },
	{ name: "Slice of Life", color: "comic-green" },
	{ name: "Thriller", color: "destructive" }
];

const STATUSES = [
	{ value: "ONGOING", label: "Ongoing", icon: Clock, variant: "info" },
	{ value: "COMPLETED", label: "Completed", icon: CheckCircle, variant: "success" },
	{ value: "HIATUS", label: "Hiatus", icon: Pause, variant: "warning" },
];

export function ComicFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
	const selectedStatus = searchParams.get("status");
	
	const updateFilter = (key: string, value: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		
		// Reset to page 1 when filtering
		params.delete("page");
		
		router.push(`/comics?${params.toString()}`);
	};
	
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateFilter("search", searchTerm.trim() || null);
	};
	
	const clearAllFilters = () => {
		setSearchTerm("");
		router.push("/comics");
	};
	
	const hasActiveFilters = selectedStatus || searchTerm;
	
	return (
		<div className="pt-6 space-y-6">
			{/* Search Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<AnimatedBadge
						variant="gradient"
						icon={<Search className="h-4 w-4" />}
						size="lg"
					>
						Search & Filter
					</AnimatedBadge>
				</div>
				
				<form onSubmit={handleSearch} className="flex gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
						<Input
							placeholder="Search comics by title, author, or description..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-12 h-12 text-base border-2 border-primary/20 focus:border-primary/60 bg-background/50 backdrop-blur-sm"
						/>
					</div>
					<GradientButton
						type="submit"
						variant="primary"
						size="lg"
						icon={<Search className="h-5 w-5" />}
					>
						<span className="hidden sm:inline">Search</span>
					</GradientButton>
				</form>
			</div>
			
			{/* Filters Section */}
			<div className="space-y-6">
				{/* Genre Quick Links */}
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<Filter className="h-5 w-5 text-primary" />
						<span className="font-semibold text-foreground">Browse by Genre</span>
						<AnimatedBadge
							variant="info"
							size="sm"
							icon={<ExternalLink className="h-3 w-3" />}
						>
							Dedicated Pages
						</AnimatedBadge>
					</div>
					<div className="flex flex-wrap gap-3">
						{GENRES.map((genre) => (
							<Link key={genre.name} href={`/genres/${genre.name.toLowerCase().replace(/\s+/g, '-')}`}>
								<AnimatedBadge
									variant="outline"
									size="lg"
									className="cursor-pointer transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:text-primary hover:shadow-glow/20"
								>
									{genre.name}
								</AnimatedBadge>
							</Link>
						))}
					</div>
					<div className="text-sm text-muted-foreground">
						Click any genre to explore dedicated genre pages with all comics in that category
					</div>
				</div>
				
				{/* Status Filter */}
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<Clock className="h-5 w-5 text-primary" />
						<span className="font-semibold text-foreground">Status</span>
					</div>
					<div className="flex flex-wrap gap-3">
						{STATUSES.map((status) => (
							<AnimatedBadge
								key={status.value}
								variant={selectedStatus === status.value ? (status.variant as any) : "outline"}
								size="lg"
								icon={<status.icon className="h-4 w-4" />}
								className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
									selectedStatus === status.value
										? 'shadow-glow'
										: 'hover:border-primary/50 hover:text-primary'
								}`}
								animation={selectedStatus === status.value ? "glow" : "none"}
								onClick={() => updateFilter("status", selectedStatus === status.value ? null : status.value)}
							>
								{status.label}
							</AnimatedBadge>
						))}
					</div>
				</div>
				
				{/* Clear Filters */}
				{hasActiveFilters && (
					<div className="pt-4 border-t border-border/50">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<AnimatedBadge
									variant="warning"
									animation="pulse"
									icon={<Sparkles className="h-4 w-4" />}
								>
									Filters Active
								</AnimatedBadge>
							</div>
							
							<GradientButton
								variant="ghost"
								size="sm"
								onClick={clearAllFilters}
								icon={<X className="h-4 w-4" />}
							>
								Clear All
							</GradientButton>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}