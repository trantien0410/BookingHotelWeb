"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../libs/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Hotel",
      active: pathname === "/",
    },
    {
      href: "/cars",
      label: "Car Rentals",
      active: pathname === "/cars",
    },
  ];
  return (
    <nav
      className={cn("flex item-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-md font-medium transition-colors hover:text-primary",
            route.active ? "text-rose-500 font-bold" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
