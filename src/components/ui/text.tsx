import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Balancer from "react-wrap-balancer";
import { cn } from "@/lib/utils";

const textVariants = cva("whitespace-normal", {
  variants: {
    variant: {
      "5xl": "font-bold text-4xl md:text-5xl leading-[130%] tracking-tight",
      "4xl":
        "font-bold text-3xl md:text-4xl leading-[130%] tracking-[-0.02rem]",
      "3xl":
        "font-bold text-2xl md:text-3xl leading-[130%] tracking-[-0.015rem]",
      "2xl":
        "font-bold text-xl md:text-2xl leading-[130%] tracking-[-0.0125rem]",
      xl: "font-bold text-lg md:text-xl leading-[130%] tracking-[-0.00875rem]",
      lg: "font-normal text-lg leading-[150%]",
      base: "font-medium text-base leading-normal",
      sm: "font-medium text-sm leading-[150%]",
      xs: "font-medium text-xs leading-[150%]",
    },
  },
  defaultVariants: {
    variant: "sm",
  },
});

type TextElement =
  | HTMLParagraphElement
  | HTMLHeadingElement
  | HTMLSpanElement
  | HTMLDivElement;

interface TextProps
  extends HTMLAttributes<TextElement>,
    VariantProps<typeof textVariants> {
  bold?: boolean;
  medium?: boolean;
  semibold?: boolean;
  sans?: boolean;
  heading?: boolean;

  balanced?: boolean;

  as?: React.ElementType;
}

const Text = forwardRef<TextElement, TextProps>(
  (
    {
      as = "p",
      className,
      children,
      variant,
      medium,
      bold,
      semibold,
      balanced = false,
      sans = true,
      heading = false,
      ...props
    },
    ref
  ) => {
    let fontWeightClass = "font-normal";
    let fontFamilyClass = "font-sans";

    if (bold) {
      fontWeightClass = "font-bold";
    } else if (semibold) {
      fontWeightClass = "font-semibold";
    } else if (medium) {
      fontWeightClass = "font-medium";
    }

    if (heading) {
      fontFamilyClass = "font-heading";
    } else if (sans) {
      fontFamilyClass = "font-sans";
    }

    const Component = as;

    return (
      <Component
        className={cn(
          "text-[inherit]",
          textVariants({ variant }),
          fontFamilyClass,
          fontWeightClass,
          className
        )}
        ref={ref as React.Ref<TextElement>}
        {...props}
      >
        {balanced ? <Balancer>{children}</Balancer> : children}
      </Component>
    );
  }
);

Text.displayName = "Text";

export { Text, textVariants };
