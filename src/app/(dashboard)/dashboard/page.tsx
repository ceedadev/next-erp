import * as React from "react";

import { ArrowTopRightIcon, ArrowBottomLeftIcon } from "@radix-ui/react-icons";

import { Sheet } from "@/components/sheet";
import { KPICard } from "@/components/kpi-card";
import { Timeline, TimelineItem } from "@/components/timeline";

import { getSession } from "@/lib/get-session";
import { getDashboardStats } from "@/lib/fetcher/dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  const stats = await getDashboardStats();
  return (
    <main className="">
      <Sheet>
        <div>
          <p className="text-muted-foreground text-sm">
            {new Date().toDateString()}
          </p>
          <p className="text-2xl font-semibold font-poppins">
            Welcome Back, {session.user.name ?? "Guest"}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 grid-flow-dense">
          <KPICard title="Total Sales">
            <p className="text-4xl">
              {Number(stats.totalSales).toLocaleString()}
              <span className="text-sm font-semibold"> USD</span>
            </p>
            <p>from paid invoices</p>
          </KPICard>
          <KPICard title="Total Inventory Value">
            <p className="text-4xl">
              {Number(stats.totalInventory).toLocaleString()}
              <span className="text-sm font-semibold"> USD</span>
            </p>
            <p>current inventory worth</p>
          </KPICard>
          <KPICard title="Business Overview">
            <div className="flex flex-row justify-evenly items-center mx-4">
              <div className="flex flex-col text-center">
                <div className="flex flex-row space-x-1 justify-center">
                  <ArrowBottomLeftIcon />
                  <p>Products</p>
                </div>
                <p className="text-4xl">
                  {stats.totalProducts} <span className="text-sm">Items</span>
                </p>
              </div>
              <div className="flex flex-col text-center">
                <div className="flex flex-row space-x-1 justify-center">
                  <ArrowTopRightIcon />
                  <p>Customers</p>
                </div>
                <p className="text-4xl">
                  {stats.totalCustomers} <span className="text-sm">Active</span>
                </p>
              </div>
            </div>
          </KPICard>
          <KPICard title="Recent Activities">
            <Timeline>
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity, index) => (
                  <TimelineItem
                    key={index}
                    message={activity.message}
                    timestamp={activity.timestamp}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activities</p>
              )}
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
