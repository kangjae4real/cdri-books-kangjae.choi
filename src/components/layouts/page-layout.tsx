import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import { Heading } from "@/components/typography";

const pageLayoutVariants = cva("w-full flex justify-center mt-18 lg:mt-32");

type PageLayoutProps = React.ComponentProps<"div"> &
  VariantProps<typeof pageLayoutVariants> & {
    title?: string;
  };

export default function PageLayout({ className, children, title, ...props }: PageLayoutProps) {
  return (
    <div className={cn(pageLayoutVariants(), className)} {...props}>
      <div
        id="page-children-container"
        className={cn("flex w-full max-w-1/2 justify-center", title && "flex-col gap-4")}
      >
        {title && (
          <div className="">
            <Heading as="h2" className="text-[#1A1E27]">
              {title}
            </Heading>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
