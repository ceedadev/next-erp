import Link from "next/link";
import { PlusIcon, DownloadIcon } from "@radix-ui/react-icons";

import { getAllCustomers } from "@/app/_actions/customer";

import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import CustomerRow from "@/components/customer-row";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CustomersPage() {
  const customers = await getAllCustomers();

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Customers", href: "/dashboard/customers" },
        ]}
      />
      <div className="flex flex-row w-full justify-end space-x-4">
        <Button asChild variant={"default"}>
          <Link href="/dashboard/customers/add">
            <PlusIcon className="mr-2" />
            <p>Add Customer</p>
          </Link>
        </Button>
        <Button disabled variant={"outline"}>
          <DownloadIcon />
        </Button>
      </div>
      <div className="overflow-auto border md:p-4 rounded-md shadow-md">
        <Table className="overflow-scroll min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead>Name & Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Sheet>
  );
}