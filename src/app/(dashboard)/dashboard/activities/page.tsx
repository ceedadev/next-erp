import { Breadcrumbs } from "@/components/breadcrumbs";
import { Sheet } from "@/components/sheet";
import { Card } from "@/components/ui/card";
import React from "react";

export default function ActivitiesPage() {
  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Activities", href: "/dashboard/activities" },
        ]}
      />
      <div className="flex flex-col">
        <Card className="shadow-sm">
          <div className="flex flex-row p-4 items-center justify-between">
            <p>
              USER <span className="italic">created</span> a new product :{" "}
              <span>ULKA Vibration Pumps</span>
            </p>
            <p>10 m ago</p>
          </div>
        </Card>
      </div>
    </Sheet>
  );
}
