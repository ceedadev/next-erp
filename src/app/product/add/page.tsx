import ProductForm from "@/components/forms/product-form";
import { Sheet } from "@/components/sheet";
import React from "react";

export default function AddProductPage() {
  return (
    <main>
      <Sheet>
        <h1>Add Product</h1>
        <ProductForm />
      </Sheet>
    </main>
  );
}
