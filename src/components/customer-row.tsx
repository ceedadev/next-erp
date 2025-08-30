"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";

import { Customer } from "@/db/schema";
import { deleteCustomer } from "@/app/_actions/customer";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TableRow, TableCell } from "@/components/ui/table";

export default function CustomerRow({ customer }: { customer: Customer }) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete() {
    try {
      await deleteCustomer(customer.id);
      toast({
        title: "Customer Deleted",
        description: `${customer.name} has been deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  }

  return (
    <TableRow key={customer.id}>
      <TableCell className="min-w-[200px]">
        <div className="flex flex-col">
          <p className="font-medium">{customer.name}</p>
          <p className="text-xs text-muted-foreground">{customer.email}</p>
        </div>
      </TableCell>
      <TableCell className="min-w-[150px]">
        {customer.phone}
      </TableCell>
      <TableCell className="min-w-[120px]">
        {customer.createdAt?.toLocaleDateString()}
      </TableCell>
      <TableCell className="w-12 text-center">
        <div className={`w-2 h-2 rounded-full mx-auto ${customer.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
      </TableCell>
      <TableCell className="space-x-2 w-32">
        <Button
          variant={"ghost"}
          size="sm"
          onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
        >
          <Pencil2Icon />
        </Button>
        <Button
          variant={"ghost"}
          size="sm"
          onClick={handleDelete}
        >
          <TrashIcon className="text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}