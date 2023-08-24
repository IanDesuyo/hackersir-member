import DefaultLayout from "@/components/layout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
