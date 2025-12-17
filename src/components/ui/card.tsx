import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

// =============================================================================
// Card - Simple wrapper with padding
// =============================================================================

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Padding size - defaults to "md" */
    padding?: CardPadding;
    /** Additional className */
    className?: string;
    children: ReactNode;
}

const paddingClasses: Record<CardPadding, string> = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

/**
 * Card - Simple container for wrapping content with consistent styling.
 * Use for auth forms, info sections, and general content containers.
 * 
 * @example
 * <Card padding="lg">
 *   <h2>Login</h2>
 *   <form>...</form>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ padding = "md", className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    "bg-card border border-border shadow-sm",
                    paddingClasses[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = "Card";

// =============================================================================
// CardInteractive - Interactive card with hover effects (for course cards, etc)
// =============================================================================

interface CardInteractiveProps extends HTMLAttributes<HTMLDivElement> {
    /** Make the entire card a link */
    asChild?: boolean;
    /** Additional className */
    className?: string;
    children: ReactNode;
}

/**
 * CardInteractive - Card with hover effects for interactive content.
 * Has NO padding so images can span full width.
 * 
 * @example
 * <Link href="/course/slug">
 *   <CardInteractive>
 *     <img src="..." className="aspect-video w-full" />
 *     <div className="p-6">
 *       <h3>Course Title</h3>
 *     </div>
 *   </CardInteractive>
 * </Link>
 */
export const CardInteractive = forwardRef<HTMLDivElement, CardInteractiveProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    "group bg-card border border-border shadow-sm overflow-hidden",
                    "flex flex-col transition-all",
                    "hover:shadow-lg hover:border-primary/50",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
CardInteractive.displayName = "CardInteractive";
