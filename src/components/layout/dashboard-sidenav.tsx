"use client";
import * as React from "react";
import {
  BoxIcon,
  BoxesIcon,
  Building2Icon,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Users2Icon,
  WalletCards,
  WarehouseIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardSidenav() {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  return (
    <aside
      className={cn(
        "border-r min-h-max space-y-4 transition-all duration-300",
        !isCollapsed && "min-w-[180px]"
      )}
    >
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              " transform duration-300 ml-2 mt-2 p-2",
              !isCollapsed && "rotate-180"
            )}
            variant={"ghost"}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronRight width={16} height={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Collapse Menu</TooltipContent>
      </Tooltip>
      <div className="mt-14">
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              //TODO: fix dashboard not being selected when on /dashboard
              title: "Dashboard",
              href: "/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "Invoices",
              icon: WalletCards,
              href: "/dashboard/invoices",
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Products",
              href: "/dashboard/products",
              icon: BoxIcon,
            },
            {
              title: "Categories",
              href: "/dashboard/categories",
              icon: BoxesIcon,
            },
            {
              title: "Inventory",
              icon: WarehouseIcon,
              href: "/dashboard/inventory",
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Customers",
              icon: Users2Icon,
              href: "/dashboard/customers",
            },
            {
              title: "Suppliers",
              icon: Building2Icon,
              href: "/dashboard/suppliers",
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Settings",
              icon: Settings,
              href: "/dashboard/settings",
            },
          ]}
        />
        <Separator />
      </div>
    </aside>
  );
}
