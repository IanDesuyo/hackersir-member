import { createApi } from "@/lib/trpc/root";
import { type CSSProperties } from "react";

type EventCountdownProps = {
  id: string;
};

export default async function EventCountdown({ id }: EventCountdownProps) {
  const api = await createApi();

  const event = await api.event.findEventById(id);
  
}
