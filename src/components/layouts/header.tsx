import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import Logo from "@/components/logo";

const headerVariants = cva("w-full h-20 flex items-center px-5 lg:px-40");

type HeaderProps = Omit<React.ComponentProps<"header">, "children"> & VariantProps<typeof headerVariants> & {};

export default function Header({ className, ...props }: HeaderProps) {
  return (
    <header className={cn(headerVariants(), className)} {...props}>
      <Logo />
    </header>
  );
}
