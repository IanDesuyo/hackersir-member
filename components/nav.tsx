"use client";

import { atom, useAtom } from "jotai";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Icons from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const navAtom = atom({
  open: false,
});

const openAtom = atom(
  get => get(navAtom).open,
  (get, set, update: boolean) => set(navAtom, { open: update })
);

type NavProps = {
  children?: React.ReactNode;
};

const Nav: React.FC<NavProps> = ({ children }) => {
  const { data: session } = useSession();
  const [open, setOpen] = useAtom(openAtom);

  return (
    <div className="flex container items-center gap-4 py-2 h-14">
      <Icons.Menu className="md:hidden" onClick={() => setOpen(!open)} />
      <Link href="/" id="brand" className="flex items-center gap-2 md:border-r-2 pr-4">
        <Image src="/static/images/logo.png" width={40} height={40} alt="logo" />
        <span className="text-xl">逢甲大學黑客社</span>
      </Link>

      <nav className="hidden md:flex items-center gap-4">
        {!session?.member.active && <Link href="/join">加入我們</Link>}
        <p>Item1</p>
        <p>Item2</p>
        {children}
      </nav>

      <div className="flex-grow" />
      <NavUser />
    </div>
  );
};

export default Nav;

const NavUser: React.FC = () => {
  const { status, data: session } = useSession();

  if (status === "authenticated") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="hover:scale-105 transition-all">
            <AvatarFallback>{session.user?.name}</AvatarFallback>
            <AvatarImage src={session.user?.image || "/static/images/default-avatar.png"} className="bg-white" />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <Link href="/member/me/profile">
            <DropdownMenuItem>
              <Icons.User className="mr-2 h-4 w-4" />
              <span>個人檔案</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/member/me/card">
            <DropdownMenuItem>
              <Icons.MemberCard className="mr-2 h-4 w-4" />
              <span>社員小卡</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => signOut()}>
            <Icons.LogOut className="mr-2 h-4 w-4" />
            <span>登出</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* <Link href="/api/auth/signin">
        <Button>申請入社</Button>
      </Link> */}

      <Button variant="secondary" onClick={() => signIn()}>
        登入
      </Button>
    </div>
  );
};
