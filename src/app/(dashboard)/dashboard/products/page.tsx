import Link from "next/link";
import { asc, ilike, sql } from "drizzle-orm";
import { PlusIcon, DownloadIcon } from "@radix-ui/react-icons";

import { db } from "@/db";
import { products } from "@/db/schema";

import { Sheet } from "@/components/sheet";
import PaginationControl from "@/components/pagination-control";
import { Breadcrumbs } from "@/components/breadcrumbs";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchInput from "@/components/search-input";
import ProductRow from "@/components/product-row";

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
    .where(ilike(products.name, `%${search}%`))
    .orderBy(asc(products.id))
    .limit(perPage)
    .offset(offset);

  const totalProducts = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(ilike(products.name, `%${search}%`));

  const numberOfPages = Math.ceil(totalProducts[0].count / perPage);

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Product", href: "/dashboard/products" },
        ]}
      />
      <div className="flex flex-row w-full justify-end space-x-4">
        <SearchInput className="max-w-sm" />
        <Button asChild variant={"default"}>
          <Link href="/dashboard/products/add">
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
                <ProductRow key={product.id} product={product} />
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
        count={totalProducts[0].count}
      />
    </Sheet>
  );
}
