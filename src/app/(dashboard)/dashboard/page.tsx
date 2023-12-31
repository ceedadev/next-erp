import * as React from "react";

import { ArrowTopRightIcon, ArrowBottomLeftIcon } from "@radix-ui/react-icons";

import { Sheet } from "@/components/sheet";
import { KPICard } from "@/components/kpi-card";
import { Timeline, TimelineItem } from "@/components/timeline";

import { auth } from "@/lib/auth";

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

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    return (
      <main className="flex flex-col justify-center items-center">
        <p>Please Login</p>
      </main>
    );
  }
  return (
    <main className="">
      <Sheet>
        <div>
          <p className="text-muted-foreground text-sm">
            {new Date().toDateString()}
          </p>
          <p className="text-2xl font-semibold font-poppins">
            Welcome Back, {session?.user?.name ?? "Guest"}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 grid-flow-dense">
          <KPICard title="Total Sales">
            <p className="text-4xl">
              43.942.739
              <span className="text-sm font-semibold"> IDR</span>
            </p>
            <p>gained 23% this week</p>
          </KPICard>
          <KPICard title="Total Inventory">
            <p className="text-4xl">
              143.312.231
              <span className="text-sm font-semibold"> IDR</span>
            </p>
            <p>gained 23% this week</p>
          </KPICard>
          <KPICard title="Inventory Flow">
            <div className="flex flex-row justify-evenly items-center mx-4 ">
              <div className="flex flex-col">
                <div className="flex flex-row space-x-2">
                  <ArrowBottomLeftIcon />
                  <p>In</p>
                </div>
                <p className="text-4xl">
                  12 <span className="text-sm">Units</span>
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row space-x-2">
                  <ArrowTopRightIcon />
                  <p>Out</p>
                </div>
                <p className="text-4xl">
                  42 <span className="text-sm">Units</span>
                </p>
              </div>
            </div>
          </KPICard>
          <KPICard title="Unique Visitors">
            <p className="text-4xl">
              20
              <span className="text-sm font-semibold"> Visitors</span>
            </p>
            <p>gained 23% this week</p>
          </KPICard>
          <KPICard title="Total Customers">
            <p className="text-4xl">
              20
              <span className="text-sm font-semibold"> Visitors</span>
            </p>
            <p>gained 23% this week</p>
          </KPICard>
          <KPICard title="Activities Timeline">
            <Timeline>
              {TIMELINE_DUMMY_DATA.map((item, index) => (
                <TimelineItem
                  key={index}
                  message={item.message}
                  timestamp={item.timestamp}
                />
              ))}
            </Timeline>
          </KPICard>
          <KPICard
            title="Sales Chart"
            className="md:col-start-1 md:col-end-4 h-80"
          >
            <p>Test</p>
          </KPICard>
        </div>
      </Sheet>
    </main>
  );
}
