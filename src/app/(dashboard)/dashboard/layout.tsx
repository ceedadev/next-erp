import MainHeader from "@/components/layout/main-header";
import MainFooter from "@/components/layout/main-layout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <div className="mb-auto">{children}</div>
      <MainFooter />
    </div>
  );
}
