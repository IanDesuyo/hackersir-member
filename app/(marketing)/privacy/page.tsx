import type { Metadata } from "next";
import { pdpa } from "@/components/privacy";

export const metadata: Metadata = {
  title: "個資聲明",
};

export default function PrivacyPage() {
  return (
    <div className="divide-y-2">
      <h1 className="text-center font-bold text-4xl whitespace-pre-line md:whitespace-normal pb-2">{`逢甲大學黑客社\n個資聲明`}</h1>
      <p className="whitespace-pre-wrap pt-2">{pdpa}</p>
    </div>
  );
}
