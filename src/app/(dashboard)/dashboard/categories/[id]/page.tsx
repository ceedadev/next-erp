import { notFound } from "next/navigation";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import CategoryForm from "@/components/forms/category-form";
import { getCategoryById } from "@/app/_actions/category";

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Categories", href: "/dashboard/categories" },
          { title: category.name, href: `/dashboard/categories/${category.id}` },
        ]}
      />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">
            Update the category information and settings.
          </p>
        </div>

        <div className="border rounded-lg shadow-sm bg-card p-6">
          <CategoryForm category={category} />
        </div>
      </div>
    </Sheet>
  );
}