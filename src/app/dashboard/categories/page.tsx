import { Breadcrumbs } from "@/components/breadcrumbs";
import { Sheet } from "@/components/sheet";
import React from "react";

export default function CategoryPage() {
  return (
    <main>
      <Sheet>
        <Breadcrumbs
          segments={[
            { title: "Home", href: "/" },
            { title: "Category", href: "/categories" },
          ]}
        />
      </Sheet>
    </main>
  );
}
