"use client";

import Link from "next/link";
import { DotsHorizontalIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer, Invoice } from "@/db/schema";

interface InvoiceRowProps {
  invoice: Invoice;
  customer: Customer | null;
}

export default function InvoiceRow({ invoice, customer }: InvoiceRowProps) {
  return (
    <TableRow>
      <TableCell>{invoice.number}</TableCell>
      <TableCell>{format(invoice.date, "dd/MM/yyyy")}</TableCell>
      <TableCell>{customer?.name}</TableCell>
      <TableCell>${Number(invoice.amount).toLocaleString()}</TableCell>
      <TableCell>{format(invoice.dueDate, "dd/MM/yyyy")}</TableCell>
      <TableCell>${Number(invoice.amount).toLocaleString()}</TableCell>
      <TableCell>
        <StatusPill status={invoice.status} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button asChild variant={"outline"} className="w-fit px-2">
              <DotsHorizontalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/invoices/${invoice.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/invoices/${invoice.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Payments</DropdownMenuLabel>
            <DropdownMenuItem>Add Payments</DropdownMenuItem>
            <DropdownMenuItem>View Payments</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Print</DropdownMenuItem>
            <DropdownMenuItem disabled>Send</DropdownMenuItem>
            <DropdownMenuItem disabled>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function StatusPill({ status }: { status: string }) {
  switch (status) {
    case "paid":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Paid
        </span>
      );
    case "unpaid":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Unpaid
        </span>
      );
    case "overdue":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ">
          Overdue
        </span>
      );
    default:
      return null;
  }
}
