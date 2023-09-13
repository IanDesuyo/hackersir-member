import Nav, { NavItem } from "@/components/nav";
import { getServerSession, hasPermissions, Permission } from "@/lib/auth";

type LayoutProps = {
  children: React.ReactNode;
};

const DefaultLayout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <Nav>
          <NavItem href="/events">活動列表</NavItem>
          {!session?.member.active && <NavItem href="/join">加入我們</NavItem>}
          {hasPermissions(session, [Permission.AdminRead]) && <NavItem href="/dashboard">管理員後台</NavItem>}
        </Nav>
      </header>
      <div className="container pt-4 mb-4">{children}</div>
    </div>
  );
};

export default DefaultLayout;
