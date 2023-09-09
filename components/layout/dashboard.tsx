"use client";

import { atom, useAtom } from "jotai";
import Nav, { NavItem } from "@/components/nav";
import DashboardSearch from "@/components/dashboard/search";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const searchAtom = atom({
  open: false,
});

const openAtom = atom(
  get => get(searchAtom).open,
  (get, set, update: boolean) => set(searchAtom, { open: update })
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [open, setOpen] = useAtom(openAtom);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <Nav title="管理員後台">
          <NavItem href="/dashboard/announcements">入社頁面</NavItem>
          <NavItem href="/dashboard/members">社員管理</NavItem>
          <NavItem href="/dashboard/events">活動管理</NavItem>
          <DashboardSearch open={open} onOpenChange={setOpen} search={["userId", "studentId", "realname"]} />
        </Nav>
      </header>
      <div className="container pt-4">{children}</div>
    </div>
  );
};

export default DashboardLayout;
