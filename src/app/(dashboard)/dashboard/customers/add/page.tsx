import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import CustomerForm from "@/components/forms/customer-form";

export default function AddCustomerPage() {
  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Customers", href: "/dashboard/customers" },
          { title: "Add Customer", href: "/dashboard/customers/add" },
        ]}
      />
      <div className="border rounded-md shadow-md">
        <CustomerForm />
      </div>
    </Sheet>
  );
}