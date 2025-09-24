"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { deleteCategory, toggleCategoryStatus } from "@/app/_actions/category";

interface Category {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  isActive: boolean;
  productCount: number;
}

interface CategoryRowProps {
  category: Category;
}

export default function CategoryRow({ category }: CategoryRowProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isPending, startTransition] = React.useTransition();

  function handleStatusToggle() {
    startTransition(async () => {
      try {
        const result = await toggleCategoryStatus(category.id, !category.isActive);
        if (result.success) {
          toast({
            title: "Category Updated",
            description: `${category.name} has been ${!category.isActive ? 'activated' : 'deactivated'}`,
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update category status",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  function handleDelete() {
    if (category.productCount > 0) {
      toast({
        title: "Cannot Delete Category",
        description: `This category contains ${category.productCount} product(s). Please reassign or remove products first.`,
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteCategory(category.id);
        if (result.success) {
          toast({
            title: "Category Deleted",
            description: `${category.name} has been deleted successfully`,
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete category",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{category.name}</span>
          {category.slug && (
            <span className="text-xs text-muted-foreground">{category.slug}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground max-w-xs">
        {category.description || (
          <span className="italic">No description</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {category.productCount}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={category.isActive}
          onCheckedChange={handleStatusToggle}
          disabled={isPending}
        />
      </TableCell>
      <TableCell className="space-x-2 w-32">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/categories/${category.id}`)}
          disabled={isPending}
        >
          <Pencil2Icon />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending || category.productCount > 0}
        >
          <TrashIcon className="text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
