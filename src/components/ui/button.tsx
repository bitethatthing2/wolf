"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:transition-colors",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
        destructive: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        outline: "border border-black bg-transparent text-black hover:bg-black/10 dark:border-white dark:text-white dark:hover:bg-white/10",
        secondary: "bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
        ghost: "bg-transparent text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10",
        link: "bg-transparent text-black underline-offset-4 hover:underline dark:text-white",
        hustle: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 font-bold",
        icon: "bg-transparent text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10 rounded-full p-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1 text-xs",
        lg: "h-12 px-6 py-3 text-base",
        xl: "h-14 px-8 py-4 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      iconSize: {
        default: "[&_svg]:h-5 [&_svg]:w-5",
        sm: "[&_svg]:h-4 [&_svg]:w-4",
        lg: "[&_svg]:h-6 [&_svg]:w-6",
        xl: "[&_svg]:h-7 [&_svg]:w-7",
      },
    },
    compoundVariants: [
      {
        variant: "icon",
        class: "p-0 flex items-center justify-center",
      },
      {
        variant: ["default", "destructive", "outline", "secondary", "hustle"],
        iconSize: "default",
        class: "[&_svg]:h-5 [&_svg]:w-5",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      iconSize: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconSize, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, iconSize, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
