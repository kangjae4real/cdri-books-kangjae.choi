import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";

const listItemVariants = cva("");

export type ListItemProps = React.ComponentProps<"li"> & VariantProps<typeof listItemVariants> & {};

export default function ListItem({ className, children, ...props }: ListItemProps) {
  return (
    <li className={cn(listItemVariants(), className)} {...props}>
      {children}
    </li>
  );
}
