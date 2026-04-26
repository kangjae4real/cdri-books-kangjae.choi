"use client";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/shadcn";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { PAGE_MAP, Pages, pages } from "@/utils/pages";
import { Text } from "@/components/typography";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

const globalNavigationVariants = cva("");

type GlobalNavigationProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof globalNavigationVariants> & {};

export default function GlobalNavigation({ className, ...props }: GlobalNavigationProps) {
  const pathname = usePathname();
  const menuActiveStyle = useCallback(
    (page: Pages) => {
      return cn(
        page === pathname &&
          "relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary",
      );
    },
    [pathname],
  );

  return (
    <div className={cn(globalNavigationVariants(), className)} {...props}>
      <NavigationMenu>
        <NavigationMenuList>
          {pages.map((page) => (
            <NavigationMenuItem key={page} className={menuActiveStyle(page)}>
              <Link href={page} className={navigationMenuTriggerStyle()}>
                <Text as="span" type="paragraphTitle">
                  {PAGE_MAP[page]}
                </Text>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
