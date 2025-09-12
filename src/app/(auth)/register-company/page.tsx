import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import CompanyForm from "@/components/forms/company-form";

export default async function RegisterCompanyPage() {
  const session = await getSession();
  
  // Require authentication for company registration
  if (!session) {
    redirect("/signup");
  }
  return (
    <main className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          Next ERP
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Complete your company registration to unlock the full 
              potential of our ERP system and start managing your business 
              operations efficiently.&rdquo;
            </p>
            <footer className="text-sm">Getting Started</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full h-full flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Register Your Company
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome {session.user.name}! Complete your company information to get started with Next ERP
            </p>
          </div>
          
          <div className="border rounded-lg shadow-sm bg-card p-6">
            <CompanyForm redirectTo="/dashboard" />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have a company registered?{" "}
              <Link
                href="/signin"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}