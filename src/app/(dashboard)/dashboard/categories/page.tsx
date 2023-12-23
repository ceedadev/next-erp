import { Breadcrumbs } from "@/components/breadcrumbs";
import { Sheet } from "@/components/sheet";
import React from "react";

export default function CategoryPage() {
  return (
    <main>
      <Sheet>
        <Breadcrumbs
          segments={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Category", href: "/dashboard/categories" },
          ]}
        />
      </Sheet>
    </main>
  );
}
