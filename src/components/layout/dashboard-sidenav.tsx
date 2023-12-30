"use client";
import * as React from "react";
import {
  ActivitySquare,
  BoxIcon,
  BoxesIcon,
  Building2Icon,
  ChevronRight,
  LayoutDashboard,
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
              title: "Dashboard",
              variant: "ghost",
              href: "/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "Activities",
              variant: "ghost",
<<<<<<< HEAD
              href: "/dashboard/activities",
=======
>>>>>>> 073b8f8a5dec9cb7d99b3a3877d21ccbd642cbc2
              icon: ActivitySquare,
            },
            {
              title: "Invoices",
              variant: "ghost",
              icon: WalletCards,
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Products",
              variant: "ghost",
              href: "/dashboard/products",
              icon: BoxIcon,
            },
            {
              title: "Categories",
              variant: "ghost",
              icon: BoxesIcon,
            },
            {
              title: "Inventory",
              variant: "ghost",
              icon: WarehouseIcon,
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Customers",
              variant: "ghost",
              icon: Users2Icon,
            },
            {
              title: "Suppliers",
              variant: "ghost",
              icon: Building2Icon,
            },
          ]}
        />
        <Separator />
      </div>
    </aside>
  );
}
