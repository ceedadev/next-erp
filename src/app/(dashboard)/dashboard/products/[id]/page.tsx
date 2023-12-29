import { eq } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

import { Sheet } from "@/components/sheet";
import ProductForm from "@/components/forms/product-form";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const product = await db.query.products.findFirst({
    where: eq(products.id, Number(id)),
  });

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Products", href: "/dashboard/products" },
          { title: `Edit ${product?.name}`, href: `/dashboard/products/${id}` },
        ]}
      />
      <ProductForm product={product} />
    </Sheet>
  );
}
