import Link from "next/link";
import Image from "next/image";
import { asc, like, sql } from "drizzle-orm";
import {
  TrashIcon,
  Pencil2Icon,
  PlusIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";

import { db } from "@/db/connect";
import { products } from "@/db/schema";

import { Sheet } from "@/components/sheet";
import PaginationControl from "@/components/pagination-control";
import { Breadcrumbs } from "@/components/breadcrumbs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchInput from "@/components/search-input";

export default async function ProductPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    perPage: number;
    sort: [string, "asc" | "desc"];
    search: string;
  };
}) {
  const page = Number(searchParams.page ?? 1);
  const perPage = searchParams.perPage ?? 10;
  const offset = (page - 1) * perPage;
  const search = searchParams.search ?? "";

  const allProducts = await db
    .select()
    .from(products)
    .where(like(products.name, `%${search}%`))
    .orderBy(asc(products.id))
    .limit(perPage)
    .offset(offset);

  const totalProducts = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(like(products.name, `%${search}%`));

  const numberOfPages = Math.ceil(totalProducts[0].count / perPage);

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Home", href: "/" },
          { title: "Product", href: "/products" },
        ]}
      />
      <div className="flex flex-row w-full justify-end space-x-4">
        <SearchInput className="max-w-sm" />
        <Button asChild variant={"default"}>
          <Link href="/products/add">
            <PlusIcon className="mr-2" />
            <p>Add Product</p>
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
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
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
                    <Input type="number" value={Number(product.price)} />
                  </TableCell>
                  <TableCell className="w-40">
                    <Input type="number" value={Number(product.quantity)} />
                  </TableCell>
                  <TableCell className="w-12">
                    <Switch checked={product.isActive} />
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationControl
        totalPages={numberOfPages}
        hasNextPage={page < numberOfPages}
        hasPrevPage={page > 1}
      />
    </Sheet>
  );
}
