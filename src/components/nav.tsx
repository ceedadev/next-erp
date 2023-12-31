"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";

export interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href: string;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const segment = useSelectedLayoutSegment();
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href ?? "#"}
                  className={cn(
                    link.href.includes(segment!)
                      ? buttonVariants({ variant: "default", size: "icon" })
                      : buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-8 w-8"
                    // link.variant === "default" &&
                    //   "dark:bg-muted dark:text-muted-foreground"
                  )}
                >
                  {" "}
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href ?? "#"}
              className={
                cn(
                  link.href.includes(segment!)
                    ? buttonVariants({ variant: "default", size: "sm" })
                    : buttonVariants({ variant: "ghost", size: "sm" }),
                  "justify-start"
                )
                // buttonVariants({ variant: link.variant, size: "sm" }),
                // link.variant === "default" && "dark:bg-muted dark:text-white",
              }
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto"
                    // link.variant === "default" &&
                    //   "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
