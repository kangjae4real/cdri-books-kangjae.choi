"use client";

import { cva, VariantProps } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/shadcn";
import Logo from "@/components/logo";
import GlobalNavigation from "@/components/layouts/global-navigation";

const headerVariants = cva(
  "fixed top-0 left-0 z-50 w-full h-header flex items-center px-5 lg:px-40 bg-background transition-transform duration-300 ease-in-out",
);

type HeaderProps = Omit<React.ComponentProps<"header">, "children"> & VariantProps<typeof headerVariants> & {};

export default function Header({ className, ...props }: HeaderProps) {
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const threshold = window.innerHeight / 2;

      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={cn(headerVariants(), hidden && "-translate-y-full", className)} {...props}>
      <Logo />
      <GlobalNavigation className="translate absolute top-1/2 left-1/2 -translate-1/2" />
    </header>
  );
}
