import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    image?: string;
    permission: number;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      permission: number;
    };
    member: {
      year: number;
      active: boolean;
      suspended: boolean;
    };
  }
}
