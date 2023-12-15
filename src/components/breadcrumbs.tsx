import * as React from "react";
import Link from "next/link";

import { cn, truncate } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";

interface BreadcrumbsProps {
  segments: {
    title: string;
    href: string;
  }[];
  separator?: React.ComponentType<{ className?: string }>;
  truncationLength?: number;
}

export function Breadcrumbs({
  segments,
  separator,
  truncationLength = 0,
}: BreadcrumbsProps) {
  const SeparatorIcon = separator ?? ChevronRightIcon;

  return (
    <nav
      aria-label="breadcrumbs"
      className="flex items-center text-sm font-medium"
    >
      {segments.map((segment, index) => {
        const isLastSegment = index === segments.length - 1;

        return (
          <React.Fragment key={segment.href}>
            <Link
              aria-current={isLastSegment ? "page" : undefined}
              href={segment.href}
              className={cn(
                "truncate transition-colors",
                isLastSegment ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {truncationLength > 0 && segment.title
                ? truncate(segment.title, truncationLength)
                : segment.title}
            </Link>
            {!isLastSegment && (
              <SeparatorIcon className="w-4 h-4 mx-2" aria-hidden />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
