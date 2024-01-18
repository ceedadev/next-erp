import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";

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
  });

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
      <div>
        <h1 className="text-2xl font-semibold">Invoice #{data?.number}</h1>
        <p className="text-sm text-muted-foreground">
          {data?.createdAt.toLocaleDateString("en-US", { dateStyle: "long" })}
        </p>
      </div>
      <p>{JSON.stringify(data)}</p>
    </Sheet>
  );
}
