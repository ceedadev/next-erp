import { getAllCustomers } from "@/app/_actions/customer";
import { getPaymentTerms } from "@/app/_actions/invoice";
import { getAllActiveProducts } from "@/app/_actions/product";

import { Breadcrumbs } from "@/components/breadcrumbs";
import InvoiceForm from "@/components/forms/invoice-form";
import { Sheet } from "@/components/sheet";

export default async function AddInvoicePage() {
  const customers = await getAllCustomers();
  const terms = await getPaymentTerms();
  const products = await getAllActiveProducts();
  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Invoices", href: "/dashboard/invoices" },
          { title: "Add", href: "/dashboard/invoices/add" },
        ]}
      />
      <InvoiceForm customers={customers} terms={terms} products={products} />
    </Sheet>
  );
}
