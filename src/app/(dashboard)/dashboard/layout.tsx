import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { auth } from "@/lib/auth";

import SideBarNav from "@/components/layout/dash-layout";
import MainHeader from "@/components/layout/main-header";
import MainFooter from "@/components/layout/main-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <SideBarNav
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      >
        {children}
      </SideBarNav>
      <MainFooter />
    </div>
  );
}
