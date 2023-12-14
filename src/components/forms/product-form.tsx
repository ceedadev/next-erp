"use client";

import { CreateProduct } from "@/lib/validations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

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

export default function ProductForm() {
  const form = useForm<z.infer<typeof CreateProduct>>({
    resolver: zodResolver(CreateProduct),
    defaultValues: {
      name: "",
    },
  });
  function onSubmit(values: z.infer<typeof CreateProduct>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-center">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Product Name</FormLabel>
                <FormDescription>
                  Product name must be unique and cannot be changed later.
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  placeholder="Product Name"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-center">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Product Price</FormLabel>
                <FormDescription>Selling price per item</FormDescription>
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Product Price"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
