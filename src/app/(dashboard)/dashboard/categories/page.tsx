import Link from "next/link";

import { Sheet } from "@/components/sheet";
import SearchInput from "@/components/search-input";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, DownloadIcon } from "@radix-ui/react-icons";
import CategoryRow from "@/components/category-row";
import PaginationControl from "@/components/pagination-control";

export default function CategoryPage({
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

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Category", href: "/dashboard/categories" },
        ]}
      />
      <div className="flex flex-row w-full justify-end space-x-4">
        <SearchInput className="max-w-sm" />
        <Button asChild variant={"default"}>
          <Link href="/dashboard/products/add">
            <PlusIcon className="mr-2" />
            <p>Add Category</p>
          </Link>
        </Button>
        <Button disabled variant={"outline"}>
          <DownloadIcon />
        </Button>
      </div>
      <div className="overflow-auto border md:p-4 rounded-md shadow-md">
        {/* TABLE HERE */}
        <Table className="overflow-scroll min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead># of Products</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
          </TableBody>
        </Table>
      </div>
      <PaginationControl
        // totalPages={numberOfPages}
        totalPages={1} //FIXME: Change this to numberOfPages
        // hasNextPage={page < numberOfPages}
        hasNextPage={page < 1} //FIXME: Change this to numberOfPages
        hasPrevPage={page > 1}
      />
    </Sheet>
  );
}
// TODO: Add Category Model to Schema, generate and push db
