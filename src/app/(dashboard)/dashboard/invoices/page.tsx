import Link from "next/link";
import { PlusIcon } from "lucide-react";

import InvoiceTabs from "@/components/invoice-tabs";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/date-range-picker";
import SearchInput from "@/components/search-input";
import InvoiceRow from "@/components/invoice-row";

import { getAllInvoices } from "@/lib/fetcher/invoice";
import { invoiceSearchParamsSchema } from "@/lib/validations/params";
import type { SearchParams } from "@/lib/types";
import { db } from "@/db";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const data = await db.query.invoices.findMany();
  return (
    <Sheet>
      <p>{JSON.stringify(searchParams)}</p>
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
        <div className="flex flex-col md:flex-row gap-4">
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
              <TableHead>Invoice Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Invoice Value</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </TableBody>
        </Table>
      </div>
      {/* TODO: ADD PAGINATION */}
    </Sheet>
  );
}
