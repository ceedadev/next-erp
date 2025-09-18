import Link from "next/link";
import { getSession } from "@/lib/get-session";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="h-screen">
      <div className="flex flex-col justify-center items-center h-full space-y-4 p-4">
        <h1 className="text-4xl font-semibold font-poppins">
          Welcome to Next ERP
        </h1>
        <p className="text-center max-w-2xl">
          A modern, open-source Enterprise Resource Planning system built with Next.js.
          Manage your customers, products, invoices, and business operations all in one place.
        </p>
        
        <div className="flex gap-4 mt-8">
          {session ? (
            <Button asChild size="lg">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/signin">
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/signup">
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>
        
        {!session && (
          <p className="text-sm text-muted-foreground mt-4">
            New to Next ERP? Create an account to get started, or sign in if you already have one
          </p>
        )}
      </div>
    </main>
  );
}
