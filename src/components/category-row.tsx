"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { TableRow, TableCell } from "@/components/ui/table";

export default function CategoryRow({}) {
  const router = useRouter();

  //   const [productState, setProductState] = React.useState<Product>(product);
  const { toast } = useToast();

  function handleInputChange(field: string, value: string | boolean) {
    // setProductState((prevState) => ({
    //   ...prevState,
    //   [field]: value,
    // }));
    // console.log(field, value);
    // toast({
    //   title: "Product updated",
    //   description: `${product.name} ${field} has been updated successfully`,
    // });
  }
  return (
    <TableRow>
      <TableCell>Category 1</TableCell>
      <TableCell className="text-xs text-muted-foreground ">
        Category 1 Description
      </TableCell>
      <TableCell>10</TableCell>
      <TableCell className="text-center">
        <Switch
        //   checked={productState.isActive}
        //   onChange={(e) =>
        //     handleInputChange("isActive", productState.isActive ? false : true)
        //   }
        />
      </TableCell>
      <TableCell className="space-x-4 w-32 justify-between">
        <Button
          variant={"ghost"}
          // onClick={() => router.push(`/dashboard/products/${product.id}`)}
        >
          <Pencil2Icon />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            toast({
              // TODO: Delete Product logic here
              //   title: "Product Deleted",
              //   description: `Product with id ${product.id} is deleted..`,
              //   variant: "destructive",
            });
            router.refresh();
          }}
        >
          <TrashIcon className="text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
