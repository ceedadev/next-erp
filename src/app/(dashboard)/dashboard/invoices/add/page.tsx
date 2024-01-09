import { getAllCustomers } from "@/app/_actions/customer";
import { getPaymentTerms } from "@/app/_actions/invoice";
import { Breadcrumbs } from "@/components/breadcrumbs";
import InvoiceForm from "@/components/forms/invoice-form";
import { Sheet } from "@/components/sheet";

export default async function AddInvoicePage() {
  const customers = await getAllCustomers();
  const terms = await getPaymentTerms();
  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Invoices", href: "/dashboard/invoices" },
          { title: "Add", href: "/dashboard/invoices/add" },
        ]}
      />
      <InvoiceForm customers={customers} terms={terms} />
    </Sheet>
  );
}
