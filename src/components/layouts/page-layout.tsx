import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";

const pageLayoutVariants = cva("w-full h-page-content overflow-y-auto flex justify-center mt-18 lg:mt-32");

type PageLayoutProps = React.ComponentProps<"div"> & VariantProps<typeof pageLayoutVariants> & {};

export default function PageLayout({ className, children, ...props }: PageLayoutProps) {
  return (
    <div className={cn(pageLayoutVariants(), className)} {...props}>
      <div id="page-children-container" className="w-full max-w-1/2">
        {children}
      </div>
    </div>
  );
}
