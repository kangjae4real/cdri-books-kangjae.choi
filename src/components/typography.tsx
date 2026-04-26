import { ComponentPropsWithoutRef } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";

const headingVariants = cva("font-bold", {
  variants: {
    element: {
      h1: "text-2xl",
      h2: "text-[22px]",
      h3: "text-lg",
    },
  },
});

type HeadingElement = "h1" | "h2" | "h3";

export type HeadingProps<As extends HeadingElement> = ComponentPropsWithoutRef<As> &
  VariantProps<typeof headingVariants> & {
    as?: As;
  };

export function Heading<As extends HeadingElement>({ as, className, element, ...props }: HeadingProps<As>) {
  const Comp = as ?? "h1";

  return <Comp className={cn(headingVariants({ element }), className)} {...(props as ComponentPropsWithoutRef<As>)} />;
}

const textVariants = cva("", {
  variants: {
    type: {
      paragraphTitle: "",
      paragraph: "",
      caption: "",
      small: "",
    },
  },
  defaultVariants: {
    type: "paragraph",
  },
});

type TextElements = "p" | "span" | "small";
type TextType = NonNullable<VariantProps<typeof textVariants>["type"]>;

const TEXT_COMPONENT_MAP = {
  paragraphTitle: "p",
  paragraph: "p",
  caption: "span",
  small: "small",
} as const satisfies Record<TextType, TextElements>;

const getTextComponent = (type: VariantProps<typeof textVariants>["type"]): TextElements => {
  return type ? TEXT_COMPONENT_MAP[type] : "p";
};

export type TextProps<As extends TextElements> = ComponentPropsWithoutRef<As> &
  VariantProps<typeof textVariants> & {
    as?: As;
  };

export function Text<As extends TextElements>({ as, className, type, ...props }: TextProps<As>) {
  const Comp = as ?? getTextComponent(type);

  return <Comp className={cn(textVariants({ type }), className)} {...(props as ComponentPropsWithoutRef<As>)} />;
}
