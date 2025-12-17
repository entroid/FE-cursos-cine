import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";

// =============================================================================
// Button Component - 6 Variants
// =============================================================================

type ButtonVariant =
    | "primary"
    | "primary-filled"
    | "accent"
    | "accent-filled"
    | "destructive"
    | "destructive-filled";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button variant */
    variant?: ButtonVariant;
    /** Button size */
    size?: ButtonSize;
    /** Render as child component (for Links) */
    asChild?: boolean;
    /** Additional className for margins, width, etc */
    className?: string;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground focus:ring-primary",
    "primary-filled":
        "border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary focus:ring-primary",
    accent:
        "border-accent bg-transparent text-accent hover:bg-accent/20 focus:ring-accent",
    "accent-filled":
        "border-accent bg-accent text-accent-foreground hover:bg-transparent hover:text-accent focus:ring-primary",
    destructive:
        "border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground focus:ring-destructive",
    "destructive-filled":
        "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};

/**
 * Button component with 6 variants and 3 sizes.
 * 
 * @example
 * // Basic usage
 * <Button variant="primary">Submit</Button>
 * 
 * // Filled variant
 * <Button variant="accent-filled">Continuar</Button>
 * 
 * // With extra classes
 * <Button variant="primary" className="w-full mt-4">Full Width</Button>
 * 
 * // As Link (using asChild)
 * <Button variant="accent-filled" asChild>
 *     <Link href="/path">Go to</Link>
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            asChild = false,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                ref={ref}
                className={clsx(
                    // Base styles
                    "inline-flex items-center justify-center",
                    "border-2 font-light uppercase",
                    "transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    // Variant styles
                    variantStyles[variant],
                    // Size styles
                    sizeStyles[size],
                    // Custom classes
                    className
                )}
                {...props}
            >
                {children}
            </Comp>
        );
    }
);

Button.displayName = "Button";
