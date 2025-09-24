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
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, DownloadIcon } from "@radix-ui/react-icons";
import CategoryRow from "@/components/category-row";
import PaginationControl from "@/components/pagination-control";
import { getCategoriesWithPagination } from "@/app/_actions/category";

export default async function CategoryPage({
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
  const perPage = Number(searchParams.perPage ?? 10);
  const search = searchParams.search ?? "";
  const sort: [string, "asc" | "desc"] = searchParams.sort ?? ["name", "asc"];

  const { data: categories, totalCount, totalPages } = await getCategoriesWithPagination(
    page,
    perPage,
    search,
    sort
  );

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Categories", href: "/dashboard/categories" },
        ]}
      />
      
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories and organization.
          </p>
        </div>
        
        <div className="flex flex-row space-x-4">
          <SearchInput className="max-w-sm" placeholder="Search categories..." />
          <Button asChild variant="default">
            <Link href="/dashboard/categories/add">
              <PlusIcon className="mr-2" />
              Add Category
            </Link>
          </Button>
          <Button disabled variant="outline">
            <DownloadIcon />
          </Button>
        </div>
      </div>

      <div className="overflow-auto border rounded-md shadow-md">
        <Table>
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
            {categories.length > 0 ? (
              categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="space-y-2">
                    <p>No categories found.</p>
                    <p className="text-sm text-muted-foreground">
                      {search ? `No categories match "${search}"` : "Create your first category to get started"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <PaginationControl
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        count={totalCount}
      />
    </Sheet>
  );
}
