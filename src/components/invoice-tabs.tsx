"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function InvoiceTabs() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  // set defaultValue according to searchParams
  const defaultValue = searchParams.get("status") ?? "all";

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.push(`${pathName}?${params.toString()}`);
  }

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger onClick={() => handleClick("all")} value="all">
          All
        </TabsTrigger>
        <TabsTrigger onClick={() => handleClick("paid")} value="paid">
          Paid
        </TabsTrigger>
        <TabsTrigger onClick={() => handleClick("unpaid")} value="unpaid">
          Unpaid
        </TabsTrigger>
        <TabsTrigger onClick={() => handleClick("overdue")} value="overdue">
          Overdue
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
