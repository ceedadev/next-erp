import * as React from "react";

import { Sheet } from "@/components/sheet";
import { Timeline, TimelineItem } from "@/components/timeline";

const TIMELINE_DUMMY_DATA = [
  { message: "Someone did something", timestamp: new Date() },
  {
    message: "Someone did something, you better check.",
    timestamp: new Date().setHours(new Date().getHours() - 1),
  },
  {
    message: "Someone did something, normal.",
    timestamp: new Date().setHours(new Date().getHours() - 2),
  },
  {
    message: "Someone did something, suspiciously.",
    timestamp: new Date().setHours(new Date().getHours() - 3),
  },
  {
    message: "Someone did something, or is he?",
    timestamp: new Date().setHours(new Date().getHours() - 4),
  },
];

export default function Home() {
  return (
    <main className="">
      <Sheet>
        <div>
          <p className="text-muted-foreground text-sm">
            {new Date().toDateString()}
          </p>
          <p className="text-2xl font-semibold font-poppins">
            Welcome Back, Armanda
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-rows-3 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 border rounded-md shadow-sm flex flex-col p-4">
            <p className="font-semibold">Enterprise Resource Planning</p>
          </div>
          <div className="col-span-1 md:row-span-2 border rounded-md shadow-sm flex flex-col p-4 space-y-4">
            <p className="font-semibold">Activities Timeline</p>
            <Timeline>
              {TIMELINE_DUMMY_DATA.map((item) => (
                <TimelineItem
                  message={item.message}
                  timestamp={item.timestamp}
                />
              ))}
            </Timeline>
          </div>
          <div className="col-span-1 md:row-span-1 md:col-span-2 border rounded-md shadow-sm flex p-4">
            03
          </div>
        </div>
      </Sheet>
    </main>
  );
}
