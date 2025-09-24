"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { CreateCategory, categorySchema } from "@/lib/validations/category";
import { createCategory, updateCategory } from "@/app/_actions/category";
import { Icons } from "../icons";

interface CategoryFormProps {
  category?: z.infer<typeof categorySchema>;
  redirectTo?: string;
}

export default function CategoryForm({ 
  category, 
  redirectTo = "/dashboard/categories" 
}: CategoryFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, startTransition] = React.useTransition();
  const isEditing = Boolean(category?.id);

  const form = useForm<z.infer<typeof CreateCategory>>({
    resolver: zodResolver(CreateCategory),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      slug: category?.slug ?? "",
    },
  });

  // Auto-generate slug from name
  const watchedName = form.watch("name");
  React.useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchedName, isEditing, form]);

  function onSubmit(values: z.infer<typeof CreateCategory>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("description", values.description || "");
        formData.append("slug", values.slug || "");

        let result;
        if (isEditing && category?.id) {
          result = await updateCategory(category.id, formData);
        } else {
          result = await createCategory(formData);
        }

        if (result.success) {
          toast({
            title: isEditing ? "Category Updated" : "Category Created",
            description: `${values.name} has been ${isEditing ? 'updated' : 'created'} successfully`,
          });
          
          if (!isEditing) {
            form.reset();
          }
          router.push(redirectTo);
        } else {
          toast({
            title: "Error",
            description: result.error || `Failed to ${isEditing ? 'update' : 'create'} category`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Software Products" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="software-products" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  URL-friendly version of the name. Auto-generated if left empty.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of this category..." 
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Optional description to help identify this category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-4 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : isEditing ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}