import LoginError from "@/components/auth/loginError";
import LoginForm from "@/components/auth/loginForm";
import { authProviders, getServerSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "登入",
};

type LoginPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession();

  const callbackUrl = searchParams.callbackUrl as string | undefined;

  if (session) {
    return redirect(callbackUrl || "/");
  }

  const providers = authProviders
    .filter(({ id }) => id !== "fcu-nid")
    .map(({ id, name, style }) => ({
      id,
      provider: name,
      logo: style?.logo,
      style: {
        color: style?.textDark,
        backgroundColor: style?.bgDark,
      },
    }));

  const error = searchParams.error as string | undefined;

  return (
    <div className="w-screen h-screen container max-w-md flex flex-col gap-4 justify-center items-center">
      {error && <LoginError error={error} />}
      <LoginForm providers={providers} callbackUrl={callbackUrl} />
    </div>
  );
}
