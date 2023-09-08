import { getApi } from "@/lib/trpc/root";
import { Terminal, TerminalLine } from "../terminal";
import { TimeCountdown } from "./client-components";
import Link from "next/link";

type EventCountdownProps = {
  eventId: string;
};

export default async function EventCountdown({ eventId }: EventCountdownProps) {
  const api = await getApi();

  const event = await api.event.getById({ eventId });

  if (!event) {
    return (
      <Terminal>
        <TerminalLine>cat events/{eventId}</TerminalLine>
        <TerminalLine noPrompt className="text-red-500">
          cat: events/{eventId}: No such file or directory
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
