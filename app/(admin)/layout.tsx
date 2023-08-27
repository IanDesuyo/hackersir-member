import Nav, { NavItem } from "@/components/nav";
import { Permission, getServerSession, hasPermissions } from "@/lib/auth";
import Forbidden from "@/components/error/forbidden";
import DefaultLayout from "@/components/layout";

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

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <Nav title="管理員後台">
          <NavItem href="/dashboard/announcements">入社頁面</NavItem>
          <NavItem href="/dashboard/members">社員管理</NavItem>
          <NavItem href="/dashboard/events">活動管理</NavItem>
        </Nav>
      </header>
      <div className="container pt-4">{children}</div>
    </div>
  );
}
