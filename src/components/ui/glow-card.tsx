import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glowCardVariants = cva(
	"relative rounded-xl transition-all duration-500 overflow-hidden group",
	{
		variants: {
			variant: {
				default: [
					"bg-card border border-border/50",
					"hover:border-primary/50 hover:shadow-glow",
					"hover:scale-[1.02] hover:-translate-y-2"
				],
				gradient: [
					"bg-gradient-to-br from-card via-card to-primary/5",
					"border border-primary/20",
					"hover:border-primary/50 hover:shadow-glow-lg",
					"hover:scale-[1.05] hover:-translate-y-3"
				],
				glass: [
					"glass border-white/20",
					"hover:border-primary/30 hover:shadow-glow",
					"hover:scale-[1.02] hover:-translate-y-1"
				],
				neon: [
					"bg-gray-900 border-2 border-neon-blue/30 shadow-neon/20",
					"hover:border-neon-blue hover:shadow-neon",
					"hover:scale-[1.03] hover:-translate-y-2"
				],
				comic: [
					"bg-gradient-to-br from-card to-primary/10",
					"border-2 border-primary/20",
					"hover:border-primary/60 hover:shadow-glow-lg",
					"hover:scale-1"
				],
				basic: [
					"bg-white",
					"hover:scale-1",
					"border border-gray-300"
				],
				gradient_basic: [
					"bg-gradient-to-br from-card via-card to-primary/5",
					"border border-primary/20",
					"hover:border-primary/50 hover:shadow-glow-lg",
					"hover:scale-1"
				],
			},
			size: {
				sm: "p-3",
				default: "p-4",
				lg: "p-6",
				xl: "p-8"
			},
			glow: {
				none: "",
				subtle: "hover:shadow-glow/50",
				normal: "hover:shadow-glow",
				strong: "hover:shadow-glow-lg",
				pulse: "animate-glow-pulse"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			glow: "normal"
		}
	}
);

export interface GlowCardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof glowCardVariants> {
	shimmer?: boolean;
	floating?: boolean;
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
	({ className, variant, size, glow, shimmer = false, floating = false, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					glowCardVariants({ variant, size, glow }),
					shimmer && [
						"before:absolute before:inset-0 before:bg-gradient-to-r",
						"before:from-transparent before:via-white/10 before:to-transparent",
						"before:translate-x-[-100%] group-hover:before:translate-x-[100%]",
						"before:transition-transform before:duration-1000 before:ease-out"
					],
					floating && "floating",
					className
				)}
				{...props}
			>
				{children}
				
				{/* Shimmer overlay */}
				{shimmer && (
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
				)}
			</div>
		);
	}
);

GlowCard.displayName = "GlowCard";

export { GlowCard, glowCardVariants };