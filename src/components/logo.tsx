import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import Link from "next/link";
import { Heading } from "@/components/typography";
import { ROOT_PAGE } from "@/utils/pages";

const logoVariants = cva("");

type LogoProps = Omit<React.ComponentProps<"a">, "children"> & VariantProps<typeof logoVariants> & {};

export default function Logo({ className, ...props }: LogoProps) {
  return (
    <Link href={ROOT_PAGE} {...props}>
      <Heading className={cn(logoVariants(), className)}>CERTICOS BOOKS</Heading>
    </Link>
  );
}
