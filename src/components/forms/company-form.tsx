"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreateCompany, companySchema } from "@/lib/validations/company";
import { createCompany, updateCompany } from "@/app/_actions/company";
import { Icons } from "../icons";

interface CompanyFormProps {
  company?: z.infer<typeof companySchema>;
  redirectTo?: string;
}

const companySizes = [
  { value: "small", label: "Small (1-10 employees)" },
  { value: "medium", label: "Medium (11-50 employees)" },
  { value: "large", label: "Large (51-200 employees)" },
  { value: "enterprise", label: "Enterprise (200+ employees)" },
];

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Construction",
  "Hospitality",
  "Transportation",
  "Other",
];

export default function CompanyForm({ company, redirectTo = "/dashboard/company" }: CompanyFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, startTransition] = React.useTransition();
  const isEditing = Boolean(company?.id);

  const form = useForm<z.infer<typeof CreateCompany>>({
    resolver: zodResolver(CreateCompany),
    defaultValues: {
      name: company?.name ?? "",
      email: company?.email ?? "",
      phone: company?.phone ?? "",
      website: company?.website ?? "",
      industry: company?.industry ?? "",
      size: company?.size as "small" | "medium" | "large" | "enterprise" | undefined,
      description: company?.description ?? "",
      address: company?.address ?? "",
      city: company?.city ?? "",
      state: company?.state ?? "",
      country: company?.country ?? "",
      postalCode: company?.postalCode ?? "",
      logo: company?.logo ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof CreateCompany>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name || "");
        formData.append("email", values.email || "");
        formData.append("phone", values.phone || "");
        formData.append("website", values.website || "");
        formData.append("industry", values.industry || "");
        formData.append("size", values.size || "");
        formData.append("description", values.description || "");
        formData.append("address", values.address || "");
        formData.append("city", values.city || "");
        formData.append("state", values.state || "");
        formData.append("country", values.country || "");
        formData.append("postalCode", values.postalCode || "");
        formData.append("logo", values.logo || "");

        if (isEditing && company?.id) {
          const result = await updateCompany(company.id, formData);
          if (result.success) {
            toast({
              title: "Company Updated",
              description: `${values.name} has been updated successfully`,
            });
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to update company",
              variant: "destructive",
            });
          }
        } else {
          const result = await createCompany(formData);
          if (result.success) {
            toast({
              title: "Company Registered",
              description: `${values.name} has been registered successfully`,
            });
            form.reset();
            router.push(redirectTo);
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to create company",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to save company information",
          variant: "destructive",
        });
      }
    });
  }

  function onClear() {
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Company Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="contact@company.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input 
                      type="url" 
                      placeholder="https://www.company.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <FormLabel>Company Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief description of your company..." 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Tell us about your company and what you do
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address Information</h3>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Business St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="10001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="United States" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Logo URL</FormLabel>
                <FormControl>
                  <Input 
                    type="url" 
                    placeholder="https://www.company.com/logo.png" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  URL to your company logo (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={isPending}
          >
            Clear
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : isEditing ? (
              "Update Company"
            ) : (
              "Register Company"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}