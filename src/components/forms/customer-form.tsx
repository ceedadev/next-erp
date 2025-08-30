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
import { useToast } from "@/components/ui/use-toast";

import { CreateCustomer, customerSchema } from "@/lib/validations/customer";
import { createCustomer, updateCustomer } from "@/app/_actions/customer";
import { Icons } from "../icons";

interface CustomerFormProps {
  customer?: z.infer<typeof customerSchema>;
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const { toast } = useToast();

  const [isPending, startTransition] = React.useTransition();
  const isEditing = Boolean(customer?.id);

  const form = useForm<z.infer<typeof CreateCustomer>>({
    resolver: zodResolver(CreateCustomer),
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof CreateCustomer>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("email", values.email || "");
        formData.append("phone", values.phone || "");

        if (isEditing && customer?.id) {
          await updateCustomer(customer.id, formData);
          toast({
            title: "Customer Updated",
            description: `${values.name} has been updated successfully`,
          });
        } else {
          await createCustomer(formData);
          toast({
            title: "Customer Created",
            description: `${values.name} has been created successfully`,
          });
          form.reset();
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to save customer",
          variant: "destructive",
        });
      }
    });
  }

  function onClear() {
    form.reset();
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
                <FormLabel>Customer Name</FormLabel>
                <FormDescription>
                  Full name of the customer.
                </FormDescription>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <FormControl>
                  <Input
                    placeholder="Customer Name"
                    {...field}
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-start">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Email Address</FormLabel>
                <FormDescription>
                  Customer&apos;s email address for communication.
                </FormDescription>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="customer@example.com"
                    {...field}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col md:flex-row gap-2 p-4 items-start">
              <div className="flex flex-col gap-2 min-w-[300px]">
                <FormLabel>Phone Number</FormLabel>
                <FormDescription>
                  Customer&apos;s contact phone number.
                </FormDescription>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...field}
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row gap-4 justify-end mt-4 border-t pt-4 px-4">
          <Button
            className="w-full md:max-w-[240px] self-center"
            type="reset"
            variant={"outline"}
            onClick={onClear}
          >
            Clear
          </Button>
          <Button
            className="w-full md:max-w-[240px] self-center"
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