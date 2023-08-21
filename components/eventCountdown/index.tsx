import { getApi } from "@/lib/trpc/root";
import { type CSSProperties } from "react";

type EventCountdownProps = {
  id: string;
};

export default async function EventCountdown({ id }: EventCountdownProps) {
  const api = await getApi();

  const event = await api.event.getById(id);

  return <div></div>;
}
