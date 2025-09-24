import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import CategoryForm from "@/components/forms/category-form";

export default function AddCategoryPage() {
  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Categories", href: "/dashboard/categories" },
          { title: "Add Category", href: "/dashboard/categories/add" },
        ]}
      />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Category</h1>
          <p className="text-muted-foreground">
            Create a new category to organize your products.
          </p>
        </div>

        <div className="border rounded-lg shadow-sm bg-card p-6">
          <CategoryForm />
        </div>
      </div>
    </Sheet>
  );
}