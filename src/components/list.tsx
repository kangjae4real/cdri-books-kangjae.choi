import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import ListItem from "@/components/list-item";

const listVariants = cva("flex flex-col");

export type ListProps<T> = Omit<React.ComponentProps<"ul">, "children"> &
  VariantProps<typeof listVariants> & {
    items: T[];
    getKey: (item: T, index: number) => string | number;
    renderItem: (item: T, index: number) => React.ReactNode;
    itemClassName?: string;
  };

export default function List<T>({ items, getKey, renderItem, itemClassName, className, ...props }: ListProps<T>) {
  return (
    <ul className={cn(listVariants(), className)} {...props}>
      {items.map((item, index) => (
        <ListItem key={getKey(item, index)} className={itemClassName}>
          {renderItem(item, index)}
        </ListItem>
      ))}
    </ul>
  );
}
