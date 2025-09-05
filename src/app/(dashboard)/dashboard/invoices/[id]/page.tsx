import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { PrinterIcon, Share2Icon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DetailedInvoicePageProps {
  params: {
    id: string;
  };
}

export default async function DetailedInvoicePage({
  params: { id },
}: DetailedInvoicePageProps) {
  const data = await db.query.invoices.findFirst({
    where: (invoice) => eq(invoice.id, id),
    with: {
      customer: {
        columns: {
          name: true,
          email: true,
          phone: true,
        },
      },
      items: {
        columns: {
          quantity: true,
          price: true,
        },
        with: {
          product: {
            columns: {
              name: true,
              sku: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return (
      <Sheet>
        <div className="flex flex-col h-full items-center justify-center self-center">
          <p>Invoice not found</p>
          <Link
            href={`/dashboard/invoices`}
            className="text-muted-foreground text-sm"
          >
            Go Back
          </Link>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Invoices", href: "/dashboard/invoices" },
          {
            title: `Invoice #${data?.number}`,
            href: `/dashboard/invoices/${id}`,
          },
        ]}
      />
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoice #{data?.number}</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(data.date), "PPP")}
          </p>
        </div>
        <div className="flex flex-row space-x-2">
          <Button variant={"outline"}>
            <PrinterIcon className="w-4 h-4" />
          </Button>
          <Button variant={"outline"}>
            <Share2Icon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {data.items && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between ">
              {data.customer && (
                <div className="">
                  <p className="text-sm ">Billed To</p>
                  <p className="text-lg font-semibold">{data.customer.name}</p>
                  <p>{data.customer.email}</p>
                  <p>{data.customer.phone}</p>
                </div>
              )}
              <div className="mr-10">
                {data.number && (
                  <div className="grid grid-cols-2 items-center gap-2">
                    <p className="text-xs text-muted-foreground text-right">
                      Invoice Number
                    </p>
                    <p className="text-sm">{data.number}</p>
                  </div>
                )}
                {data.reference && (
                  <div className="grid grid-cols-2 items-center gap-2">
                    <p className="text-xs text-muted-foreground text-right">
                      Invoice Reference
                    </p>
                    <p className="text-sm">{data.reference}</p>
                  </div>
                )}
                {data.date && (
                  <div className="grid grid-cols-2 items-center gap-2">
                    <p className="text-xs text-muted-foreground text-right">
                      Invoice Date
                    </p>
                    <p className="text-sm">
                      {format(new Date(data.date), "PPP")}
                    </p>
                  </div>
                )}
                {data.dueDate && (
                  <div className="grid grid-cols-2 items-center gap-2">
                    <p className="text-xs text-muted-foreground text-right">
                      Invoice Due Date
                    </p>
                    <p className="text-sm">
                      {format(new Date(data.dueDate), "PPP")}
                    </p>
                  </div>
                )}
                {data.status && (
                  <div className="grid grid-cols-2 items-center gap-2">
                    <p className="text-xs text-muted-foreground text-right">
                      Status
                    </p>
                    <p className="text-sm capitalize">{data.status}</p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="md:px-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-muted-foreground">
                      {item.product?.sku}
                    </TableCell>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>${Number(item.price).toLocaleString()}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${(Number(item.price) * item.quantity).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-right">
                    Subtotal
                  </TableCell>
                  <TableCell>${Number(data.amount).toLocaleString()}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
          {data.note && (
            <CardFooter>
              <div className="space-y-2">
                <p>Invoice Note</p>
                <p className="text-sm text-muted-foreground">{data.note}</p>
              </div>
            </CardFooter>
          )}
        </Card>
      )}
      <Separator />
      <h2 className="text-lg font-semibold">Payment History</h2>
      <p className="text-muted-foreground text-xs">{JSON.stringify(data)}</p>
    </Sheet>
  );
}
