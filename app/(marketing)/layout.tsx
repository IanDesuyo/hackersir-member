import DefaultLayout from "@/components/layout/default";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
