import { getApi } from "@/lib/trpc/root";
import { type CSSProperties } from "react";
import { Terminal, TerminalLine } from "../terminal";
import { TimeCountdown } from "./client-components";
import Link from "next/link";

type EventCountdownProps = {
  id: string;
};

export default async function EventCountdown({ id }: EventCountdownProps) {
  const api = await getApi();

  const event = await api.event.getById(id);

  if (!event) {
    return (
      <Terminal>
        <TerminalLine>cat events/{id}</TerminalLine>
        <TerminalLine noPrompt className="text-red-500">
          cat: events/{id}: No such file or directory
        </TerminalLine>
      </Terminal>
    );
  }

  return (
    <Terminal>
      <TerminalLine>cat events/{event.id}</TerminalLine>

      <TerminalLine noPrompt className="font-bold text-lg">
        <Link href={`/events/${event.id}`}>{`[${event.type}] ${event.name}`}</Link>
      </TerminalLine>

      <TerminalLine noPrompt>
        地點: {event.venue} | 時間: {event.startAt.toLocaleString("zh-TW")}
      </TerminalLine>

      <TerminalLine noPrompt className="text-sm">
        {event.description}
      </TerminalLine>

      <TerminalLine noPrompt>
        <TimeCountdown time={event.startAt} />
      </TerminalLine>
    </Terminal>
  );
}
