import { notFound } from "next/navigation";

import { getCompanyById } from "@/app/_actions/company";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import CompanyForm from "@/components/forms/company-form";

interface EditCompanyPageProps {
  params: {
    id: string;
  };
}

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const company = await getCompanyById(params.id);

  if (!company) {
    notFound();
  }

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Companies", href: "/dashboard/company" },
          { title: "Edit Company", href: `/dashboard/company/${params.id}` },
        ]}
      />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Company</h1>
          <p className="text-muted-foreground">
            Update {company.name}&apos;s information.
          </p>
        </div>
        
        <div className="border rounded-lg shadow-sm bg-card">
          <div className="p-6">
            <CompanyForm company={company} />
          </div>
        </div>
      </div>
    </Sheet>
  );
}