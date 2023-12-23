import { Sheet } from "@/components/sheet";
import ProductForm from "@/components/forms/product-form";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function AddProductPage() {
  return (
    <main>
      <Sheet>
        <Breadcrumbs
          segments={[
            { title: "Home", href: "/" },
            { title: "Product", href: "/products" },
            { title: "Add Product", href: "/products/add" },
          ]}
        />
        <ProductForm />
      </Sheet>
    </main>
  );
}
