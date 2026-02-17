import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-[0.98] shadow-sm transition-all",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md active:scale-[0.98] shadow-sm",
        outline: "border-2 border-input bg-transparent hover:bg-muted/80 hover:border-primary/50 active:scale-[0.98] transition-all",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md active:scale-[0.98] transition-all shadow-sm",
        ghost: "hover:bg-muted/80 hover:text-foreground active:bg-muted transition-all",
        link: "text-foreground underline-offset-4 hover:underline hover:text-primary transition-colors",
        hero: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-[1.02] active:scale-[0.99] transition-all",
        gradient: "bg-gradient-secondary text-foreground hover:scale-[1.03] hover:shadow-lg active:scale-[1.01] transition-all shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-lg",
        sm: "h-9 px-3 rounded-lg text-xs",
        lg: "h-12 px-8 rounded-xl text-base font-semibold",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
