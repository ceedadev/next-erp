import { redirect } from "next/navigation";

import { getSession } from "@/lib/get-session";

import MainHeader from "@/components/layout/main-header";
import MainFooter from "@/components/layout/main-layout";
import DashboardSidenav from "@/components/layout/dashboard-sidenav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <div className="flex flex-grow min-w-full">
        <DashboardSidenav />
        <div className="w-full">{children}</div>
      </div>
      <MainFooter />
    </div>
  );
}
