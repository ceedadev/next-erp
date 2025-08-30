import { notFound } from "next/navigation";

import { getCustomerById } from "@/app/_actions/customer";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import CustomerForm from "@/components/forms/customer-form";

interface EditCustomerPageProps {
  params: {
    id: string;
  };
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const customer = await getCustomerById(params.id);

  if (!customer) {
    notFound();
  }

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Customers", href: "/dashboard/customers" },
          { title: "Edit Customer", href: `/dashboard/customers/${params.id}` },
        ]}
      />
      <div className="border rounded-md shadow-md">
        <CustomerForm customer={customer} />
      </div>
    </Sheet>
  );
}