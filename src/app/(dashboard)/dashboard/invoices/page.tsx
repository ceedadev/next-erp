import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Sheet } from "@/components/sheet";
import InvoiceTabs from "@/components/invoice-tabs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/date-range-picker";
import SearchInput from "@/components/search-input";

export default function InvoicesPage() {
  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Invoices", href: "/dashboard/invoices" },
        ]}
      />
      <div className="flex flex-row gap-4">
        <Card className="h-28 w-56 p-4">
          <p className="text-sm font-semibold text-muted-foreground">
            Total Invoices
          </p>
          <p className="text-2xl font-bold">12</p>
        </Card>
        <Card className="h-28 w-56 p-4">
          <p className="text-sm font-semibold text-muted-foreground">
            Total Overdue
          </p>
          <p className="text-xl font-bold">IDR 123.456.789</p>
        </Card>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between gap-4">
        <InvoiceTabs />
        <div className="flex flex-row gap-4">
          <SearchInput className="min-w-[240px]" />
          <DatePickerWithRange />
          <Link href="/dashboard/invoices/add">
            <Button variant={"default"}>
              <PlusIcon className="mr-2" />
              <p>Add Invoice</p>
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-auto border md:p-4 rounded-md shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total Due</TableHead>
              <TableHead>Invoice Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    </Sheet>
  );
}
