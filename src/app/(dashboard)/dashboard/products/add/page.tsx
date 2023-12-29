import { Sheet } from "@/components/sheet";
import ProductForm from "@/components/forms/product-form";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function AddProductPage() {
  return (
    <main>
      <Sheet>
        <Breadcrumbs
          segments={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Product", href: "/dashboard/products" },
            { title: "Add Product", href: "/dashboard/products/add" },
          ]}
        />
        <ProductForm />
      </Sheet>
    </main>
  );
}
