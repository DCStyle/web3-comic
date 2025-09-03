"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  className?: string;
  delay?: number;
  duration?: number;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square" | "triangle" | "hexagon";
  variant?: "primary" | "secondary" | "accent" | "neon";
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  className,
  delay = 0,
  duration = 3,
  size = "md",
  shape = "circle",
  variant = "primary"
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-4 h-4", 
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-sm",
    triangle: "triangle",
    hexagon: "hexagon"
  };

  const variantClasses = {
    primary: "bg-primary/20",
    secondary: "bg-secondary/20",
    accent: "bg-accent/20",
    neon: "bg-neon-blue/30 shadow-neon/50"
  };

  const animationStyle = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };

  return (
    <div
      className={cn(
        "absolute pointer-events-none floating",
        sizeClasses[size],
        shapeClasses[shape],
        variantClasses[variant],
        className
      )}
      style={animationStyle}
    />
  );
};

interface FloatingElementsProps {
  className?: string;
  count?: number;
  variant?: "subtle" | "normal" | "dense" | "geometric";
  animated?: boolean;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  className,
  count = 12,
  variant = "normal",
  animated = true
}) => {
  const elements = React.useMemo(() => {
    const shapes: ("circle" | "square" | "triangle" | "hexagon")[] = ["circle", "square", "triangle", "hexagon"];
    const sizes: ("sm" | "md" | "lg" | "xl")[] = ["sm", "md", "lg", "xl"];
    const variants: ("primary" | "secondary" | "accent" | "neon")[] = ["primary", "secondary", "accent", "neon"];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 4,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      variant: variants[Math.floor(Math.random() * variants.length)],
    }));
  }, [count]);

  const densityClasses = {
    subtle: "opacity-30",
    normal: "opacity-50",
    dense: "opacity-70",
    geometric: "opacity-40"
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden", densityClasses[variant], className)}>
      {elements.map((element) => (
        <FloatingElement
          key={element.id}
          className={`top-[${element.top}%] left-[${element.left}%]`}
          delay={animated ? element.delay : 0}
          duration={animated ? element.duration : 0}
          size={element.size}
          shape={variant === "geometric" ? element.shape : "circle"}
          variant={element.variant}
          style={{
            top: `${element.top}%`,
            left: `${element.left}%`
          }}
        />
      ))}
    </div>
  );
};

// Pre-built geometric patterns
const GeometricPattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("absolute inset-0 overflow-hidden opacity-20", className)}>
    <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/30 rotate-45" />
    <div className="absolute top-32 right-20 w-16 h-16 rounded-full border-2 border-accent/30" />
    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-secondary/20 rotate-12" />
    <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-primary/20 rounded-full" />
    <div className="absolute top-1/2 left-1/2 w-6 h-6 border-2 border-neon-blue/40 -translate-x-1/2 -translate-y-1/2 rotate-45" />
  </div>
);

export { FloatingElements, FloatingElement, GeometricPattern };