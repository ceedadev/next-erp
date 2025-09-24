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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import InventoryRow from "@/components/inventory-row";
import PaginationControl from "@/components/pagination-control";
import {
  getInventoryWithPagination,
  getInventoryStats,
} from "@/app/_actions/inventory";
import { getAllCategories } from "@/app/_actions/category";
import { AlertTriangle, DownloadIcon, Package, TrendingUp } from "lucide-react";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    perPage: number;
    sort: [string, "asc" | "desc"];
    search: string;
    category: string;
    lowStock: string;
  };
}) {
  const page = Number(searchParams.page ?? 1);
  const perPage = Number(searchParams.perPage ?? 10);
  const search = searchParams.search ?? "";
  const sort: [string, "asc" | "desc"] = searchParams.sort ?? ["name", "asc"];
  const categoryId = searchParams.category ?? "";
  const lowStock = searchParams.lowStock === "true";

  const [{ data: inventory, totalCount, totalPages }, stats, categories] =
    await Promise.all([
      getInventoryWithPagination(
        page,
        perPage,
        search,
        sort,
        categoryId,
        lowStock,
      ),
      getInventoryStats(),
      getAllCategories(),
    ]);

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Inventory", href: "/dashboard/inventory" },
        ]}
      />

      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Inventory Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your product stock levels.
            </p>
          </div>

          <div className="flex flex-row space-x-4">
            <SearchInput
              className="max-w-sm"
              placeholder="Search products..."
            />
            <Button disabled variant="outline">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Active inventory items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {stats.lowStockItems}
              </div>
              <p className="text-xs text-muted-foreground">
                Items with ≤10 units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.outOfStockItems}
              </div>
              <p className="text-xs text-muted-foreground">
                Items needing restock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button variant={!lowStock ? "default" : "outline"} size="sm" asChild>
            <Link href="/dashboard/inventory">All Items</Link>
          </Button>
          <Button variant={lowStock ? "default" : "outline"} size="sm" asChild>
            <Link href="/dashboard/inventory?lowStock=true">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Low Stock
            </Link>
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={categoryId === category.id ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/dashboard/inventory?category=${category.id}`}>
                {category.name}
              </Link>
            </Button>
          ))}
        </div>

        {/* Inventory Table */}
        <div className="overflow-auto border rounded-md shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Stock Level</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <InventoryRow key={item.id} item={item} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="space-y-2">
                      <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p>No inventory items found.</p>
                      <p className="text-sm text-muted-foreground">
                        {search
                          ? `No items match "${search}"`
                          : "Add products to start managing inventory"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <PaginationControl
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          count={totalCount}
        />
      </div>
    </Sheet>
  );
}
