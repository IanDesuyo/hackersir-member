import { Permission, getServerSession, hasPermissions } from "@/lib/auth";
import Forbidden from "@/components/error/forbidden";
import DefaultLayout from "@/components/layout/default";
import DashboardLayout from "@/components/layout/dashboard";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession();

  if (!hasPermissions(session, [Permission.AdminRead])) {
    return (
      <DefaultLayout>
        <Forbidden />
      </DefaultLayout>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
