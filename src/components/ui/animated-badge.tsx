import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animatedBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "text-foreground border border-input bg-transparent hover:bg-transparent hover:text-accent-foreground",
        success: "border-transparent bg-comic-green text-white hover:bg-comic-green/90",
        warning: "border-transparent bg-comic-yellow text-black hover:bg-comic-yellow/90",
        info: "border-transparent bg-comic-blue text-white hover:bg-comic-blue/90",
        gradient: "bg-gradient-primary text-white shadow-md hover:shadow-glow",
        neon: "bg-black text-neon-blue border border-neon-blue/50 shadow-neon/30 hover:shadow-neon",
        glass: "glass text-foreground border border-white/20 hover:border-white/40",
        pulse: "bg-primary text-primary-foreground animate-glow-pulse"
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base"
      },
      animation: {
        none: "",
        bounce: "animate-bounce",
        pulse: "animate-pulse",
        ping: "animate-ping",
        float: "floating",
        glow: "animate-glow-pulse"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none"
    }
  }
);

export interface AnimatedBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof animatedBadgeVariants> {
  icon?: React.ReactNode;
  dot?: boolean;
  count?: number;
}

const AnimatedBadge = React.forwardRef<HTMLDivElement, AnimatedBadgeProps>(
  ({ className, variant, size, animation, icon, dot = false, count, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(animatedBadgeVariants({ variant, size, animation }), className)}
        {...props}
      >
        <div className="flex items-center gap-1">
          {dot && (
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
          )}
          {icon}
          {children}
          {typeof count === 'number' && count > 0 && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </div>
      </div>
    );
  }
);

AnimatedBadge.displayName = "AnimatedBadge";

export { AnimatedBadge, animatedBadgeVariants };