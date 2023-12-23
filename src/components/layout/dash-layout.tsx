"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

import { Boxes, Package } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Nav } from "@/components/nav";

interface SideBarNavProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
  children: React.ReactNode;
}

// contains sidebar navigation and main content area
export default function SideBarNav({
  children,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize = 15,
}: SideBarNavProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="min-h-[800px] items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={15}
        maxSize={20}
        // @ts-expect-error
        onCollapse={(collapsed) => {
          setIsCollapsed(collapsed);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            collapsed
          )}`;
        }}
        className={cn(isCollapsed && "transition-all duration-300 ease-in-out")}
      >
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Products",
              icon: Package,
              variant: "ghost",
            },
            {
              title: "Categories",
              icon: Boxes,
              variant: "ghost",
            },
          ]}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="flex flex-grow mb-auto">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

const navLinks = [
  {
    title: "Products",
    icon: Package,
    variant: "ghost",
  },
  {
    title: "Categories",
    icon: Boxes,
    variant: "ghost",
  },
];
