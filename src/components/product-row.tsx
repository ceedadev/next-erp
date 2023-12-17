"use client";

import * as React from "react";
import Image from "next/image";

import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";

import { Product } from "@/db/schema";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TableRow, TableCell } from "@/components/ui/table";

export default function ProductRow({ product }: { product: Product }) {
  const [productState, setProductState] = React.useState<Product>(product);
  const { toast } = useToast();

  function handleInputChange(field: string, value: string | boolean) {
    setProductState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    console.log(field, value);
    toast({
      title: "Product updated",
      description: `${product.name} ${field} has been updated successfully`,
    });
  }

  return (
    <TableRow key={product.id}>
      <TableCell className="w-12">
        {product.image ? (
          <Image
            src={product.image}
            className="w-10 h-10"
            width={40}
            height={40}
            alt={`${product.name} thumbnail image`}
          />
        ) : (
          <div className="w-10 h-10 bg-neutral-400" />
        )}
      </TableCell>
      <TableCell className="flex flex-col items-start justify-center min-w-[300px]">
        <p>{product.name}</p>
        <p className="text-xs text-muted-foreground">SKU</p>
      </TableCell>
      <TableCell className="w-40">
        <Input
          type="number"
          value={Number(productState.price)}
          onChange={(e) => handleInputChange("price", e.target.value)}
        />
      </TableCell>
      <TableCell className="w-40">
        <Input
          type="number"
          value={Number(productState.quantity)}
          onChange={(e) => handleInputChange("quantity", e.target.value)}
        />
      </TableCell>
      <TableCell className="w-12">
        <Switch
          checked={productState.isActive}
          onChange={(e) =>
            handleInputChange("isActive", productState.isActive ? false : true)
          }
        />
      </TableCell>
      <TableCell className="space-x-4 w-32 justify-between">
        <Button variant={"ghost"}>
          <Pencil2Icon />
        </Button>
        <Button variant={"ghost"}>
          <TrashIcon className="text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
