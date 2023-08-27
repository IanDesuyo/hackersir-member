import type { Metadata } from "next";
import DefaultLayout from "@/components/layout/default";
import ErrorMessage from "@/components/error";

export const metadata: Metadata = {
  title: "404 Not Found | 逢甲大學黑客社",
};

export default function NotFound() {
  return (
    <DefaultLayout>
      <ErrorMessage title="頁面不存在" message="我是誰? 我在哪裡?" />
    </DefaultLayout>
  );
}
