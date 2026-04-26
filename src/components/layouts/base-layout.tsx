import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import Header from "@/components/layouts/header";

const baseLayoutVariants = cva("w-full");

type BaseLayoutProps = React.ComponentProps<"div"> &
  VariantProps<typeof baseLayoutVariants> & {
    withHeader?: boolean;
  };

export default function BaseLayout({ className, children, withHeader = true, ...props }: BaseLayoutProps) {
  return (
    <div className={cn(baseLayoutVariants(), withHeader && "pt-header", className)} {...props}>
      {withHeader && <Header />}
      {children}
    </div>
  );
}
