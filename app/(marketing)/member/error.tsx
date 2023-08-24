"use client";

import Forbidden from "@/components/error/forbidden";
import Internal from "@/components/error/internal";
import BadRequest from "@/components/error/badRequest";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  if (error.message === "FORBIDDEN") {
    return <Forbidden />;
  }

  // Zod errors
  if (error.message.includes("code") && error.message.includes("path")) {
    return <BadRequest />;
  }

  return <Internal />;
}
