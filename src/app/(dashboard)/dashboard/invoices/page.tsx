import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";

import InvoiceTabs from "@/components/invoice-tabs";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/date-range-picker";
import SearchInput from "@/components/search-input";
import InvoiceRow from "@/components/invoice-row";

import { getAllInvoices } from "@/lib/fetcher/invoice";
import {
  invoiceSearchParamsSchema,
  searchParamsSchema,
} from "@/lib/validations/params";
import type { SearchParams } from "@/lib/types";
import { db } from "@/db";
import PaginationControl from "@/components/pagination-control";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, perPage, sort, search, from, to, status } =
    invoiceSearchParamsSchema.parse(searchParams);

  // Invoices
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const perPageAsNumber = Number(perPage);
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;
  const fromDay = from ? startOfDay(new Date(from)) : undefined;
  const toDay = to ? endOfDay(new Date(to)) : undefined;

  const { data, count, pageCount } = await getAllInvoices({
    limit,
    offset,
    search,
    sort,
    fromDay,
    toDay,
    status,
  });

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
          <p className="text-2xl font-bold">{count}</p>
        </Card>
        <Card className="h-28 w-56 p-4">
          <p className="text-sm font-semibold text-muted-foreground">
            Total Overdue
          </p>
          <p className="text-xl font-bold">
            {data.filter(item => item.invoices.status === "overdue").length}
          </p>
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
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
            {data.map((item, index) => (
              <InvoiceRow
                key={index}
                invoice={item.invoices}
                customer={item.customers}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      {/* TODO: ADD PAGINATION */}
      <PaginationControl
        hasNextPage={page < pageCount}
        hasPrevPage={page > 1}
        totalPages={pageCount}
        count={count}
      />
    </Sheet>
  );
}
