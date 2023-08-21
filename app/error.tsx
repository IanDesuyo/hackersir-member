"use client";

import Forbidden from "@/components/error/forbidden";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  if (error.message === "FORBIDDEN") {
    return <Forbidden />;
  }
}
