"use client";
import * as React from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { sluggify } from "@/lib/format";
import { insertProduct } from "@/lib/actions/product";
import { CreateProduct, productSchema } from "@/lib/validations/product";
import { Icons } from "../icons";

interface ProductFormProps {
  product?: z.infer<typeof productSchema>;
}

export default function ProductForm({ product }: ProductFormProps) {
  const { toast } = useToast();

  const [isPending, startTransition] = React.useTransition();
  // Detect if we are editing or creating a new product
  const isEditing = Boolean(product?.id);

  // File input
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", "IMAGE URL FROM STORAGE");
    }
  };

  const form = useForm<z.infer<typeof CreateProduct>>({
    resolver: zodResolver(CreateProduct),
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ?? "0",
      sku: product?.sku ?? "",
      description: product?.description ?? "",
      image: product?.image ?? null,
    },
  });
  function onSubmit(values: z.infer<typeof CreateProduct>) {
    startTransition(async () => {
      if (isEditing) {
        console.log(`Editing product with id ${product?.id}`);
        console.log(values);
      } else {
        console.log("Creating product");
        try {
          values.slug = sluggify(values.name!);
          await insertProduct(values);
          toast({
            title: "Product Created",
            description: `${values.name} has been created successfully`,
          });
          form.reset();
        } catch (error) {
          console.log(error);
        }
        if (values.name) {
          values.slug = sluggify(values.name);
        }
        console.log(values);
      }
    });
  }

  function onClear() {
    form.reset();
    setSelectedImage(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-start">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Product Name</FormLabel>
                <FormDescription>
                  Product name must be unique and cannot be changed later.
                </FormDescription>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <FormControl>
                  <Input
                    placeholder="Product Name"
                    {...field}
                    autoComplete="off"
                    disabled={isEditing}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-start">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Product Price</FormLabel>
                <FormDescription>Selling price per item.</FormDescription>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Product Price"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-start">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Product SKU</FormLabel>
                <FormDescription>
                  Stock Keeping Unit, must be unique.
                </FormDescription>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Product SKU"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-start">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Product Description</FormLabel>
                <FormDescription>
                  Product description, can be changed later.
                </FormDescription>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <FormControl>
                  <Textarea placeholder="Product Description" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-start">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Product Image</FormLabel>
                <FormDescription>
                  Product image, can be changed later.
                </FormDescription>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    onAbort={() => setSelectedImage(null)}
                  />
                </FormControl>
                <FormMessage />
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt={"Selected product image"}
                    className="w-full md:w-40 aspect-square object-cover shadow-md"
                  />
                )}
              </div>
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row gap-4 justify-end mt-4 border-t pt-4 px-4">
          <Button
            className="w-full md:max-w-[240px] self-center  "
            type="reset"
            variant={"outline"}
            onClick={onClear}
          >
            Clear
          </Button>
          <Button
            className="w-full md:max-w-[240px] self-center  "
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner className="animate-spin" />
            ) : isEditing ? (
              "Save"
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
