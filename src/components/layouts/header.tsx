import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import Logo from "@/components/logo";
import GlobalNavigation from "@/components/layouts/global-navigation";

const headerVariants = cva("w-full h-20 flex items-center px-5 lg:px-40 relative");

type HeaderProps = Omit<React.ComponentProps<"header">, "children"> & VariantProps<typeof headerVariants> & {};

export default function Header({ className, ...props }: HeaderProps) {
  return (
    <header className={cn(headerVariants(), className)} {...props}>
      <Logo />
      <GlobalNavigation className="translate absolute top-1/2 left-1/2 -translate-1/2" />
    </header>
  );
}
