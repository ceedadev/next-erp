import { asc, sql } from "drizzle-orm";
import { TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";

import { db } from "@/db/connect";
import { products } from "@/db/schema";

import { Sheet } from "@/components/sheet";
import PaginationControl from "@/components/pagination-control";

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

export default async function ProductPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    perPage: number;
    sort: [string, "asc" | "desc"];
  };
}) {
  const page = Number(searchParams.page ?? 1);
  const perPage = searchParams.perPage ?? 10;
  const offset = (page - 1) * perPage;

  const allProducts = await db
    .select()
    .from(products)
    .orderBy(asc(products.id))
    .limit(perPage)
    .offset(offset);

  const totalProducts = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);

  const numberOfPages = Math.ceil(totalProducts[0].count / perPage);

  return (
    <Sheet>
      <p>Product Page</p>
      <p>{JSON.stringify(allProducts)}</p>
      <p>{JSON.stringify(totalProducts)}</p>
      <p>{numberOfPages}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-center">Active</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell className="">{product.name}</TableCell>
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
          ))}
        </TableBody>
      </Table>
      <PaginationControl
        totalPages={numberOfPages}
        hasNextPage={page < numberOfPages}
        hasPrevPage={page > 1}
      />
    </Sheet>
  );
}
