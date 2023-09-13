import type { Metadata } from "next";
import { pdpa } from "@/components/privacy";

export const metadata: Metadata = {
  title: "保密協議",
};

export default async function NDAPage() {
  const res = await fetch("https://cdn.jsdelivr.net/gh/HackerSir/Non-Disclosure-Agreement/NDA.md", {
    next: { revalidate: 3600 },
  });

  const nda = res.ok
    ? await res.text()
    : "載入失敗, 請前往查看\nhttps://github.com/HackerSir/Non-Disclosure-Agreement/blob/main/NDA.md";

  return (
    <div className="divide-y-2">
      <h1 className="text-center font-bold text-4xl whitespace-pre-line md:whitespace-normal pb-2">{`逢甲大學黑客社\n保密協議`}</h1>
      <p className="whitespace-pre-wrap pt-2">{nda}</p>
    </div>
  );
}
