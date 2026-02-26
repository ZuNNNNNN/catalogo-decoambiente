import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-content-center gap-2 rounded-full font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#5C3D2E] text-white hover:bg-[#C9956B] shadow-md hover:shadow-lg hover:-translate-y-0.5",
        accent:
          "bg-[#C9956B] text-white hover:bg-[#5C3D2E] shadow-md hover:shadow-lg hover:-translate-y-0.5",
        outline:
          "border-2 border-[#5C3D2E] text-[#5C3D2E] hover:bg-[#5C3D2E] hover:text-white",
        ghost: "text-[#5C3D2E] hover:bg-[#F8F3EC] hover:text-[#5C3D2E]",
        white:
          "bg-white text-[#5C3D2E] hover:bg-[#F8F3EC] shadow-md hover:-translate-y-0.5",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        xl: "px-10 py-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
