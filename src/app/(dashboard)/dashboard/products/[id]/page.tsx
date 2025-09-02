import { notFound } from "next/navigation";

import { getProductById } from "@/lib/actions/product";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import ProductForm from "@/components/forms/product-form";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Products", href: "/dashboard/products" },
          { title: "Edit Product", href: `/dashboard/products/${params.id}` },
        ]}
      />
      <div className="border rounded-md shadow-md">
        <ProductForm product={product} />
      </div>
    </Sheet>
  );
}
