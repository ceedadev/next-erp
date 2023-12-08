import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export function Timeline({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col">
      <ul className="flex-grow flex flex-col mb-4">{children}</ul>
      <Button>View More</Button>
    </div>
  );
}
export function TimelineItem({
  timestamp,
  message,
}: {
  timestamp: Date | number;
  message: string;
}) {
  return (
    <li className="border-l-2 border-neutral-200 dark:border-neutral-600 z-0 flex flex-row pb-2">
      <div className="w-3 h-3 rounded-full bg-neutral-600 dark:bg-neutral-200 -ml-[7px] z-50 " />
      <div className="w-full flex flex-col ml-2 -mt-1">
        <p className="text-muted-foreground italic text-xs tracking-tight">
          {dayjs(timestamp).fromNow()}
        </p>
        <p className="text-sm">{message}</p>
      </div>
    </li>
  );
}
