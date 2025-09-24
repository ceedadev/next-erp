import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Sheet } from "@/components/sheet";
import { Separator } from "@/components/ui/separator";
import CompanyForm from "@/components/forms/company-form";
import { getCurrentUserCompany } from "@/app/_actions/company";

export default async function SettingsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/signin");
  }

  const company = await getCurrentUserCompany();

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Settings", href: "/dashboard/settings" },
        ]}
      />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and company information.
          </p>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Company Info</h2>
            <p className="text-muted-foreground">
              Update your company information and business details.
            </p>
          </div>
          
          <div className="border rounded-lg shadow-sm bg-card p-6">
            <CompanyForm company={company} redirectTo="/dashboard/settings" />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Account Settings</h2>
            <p className="text-muted-foreground">
              Manage your account preferences and security settings.
            </p>
          </div>
          
          <div className="border rounded-lg shadow-sm bg-card p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm text-muted-foreground">{session.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm text-muted-foreground">{session.user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}