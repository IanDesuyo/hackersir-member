import type { Metadata } from "next";
import { Terminal, TerminalLine } from "@/components/terminal";
import { getApi } from "@/lib/trpc/root";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "活動列表",
  description: "社團近期的活動資訊都在這裡!",
};

export default async function HomePage() {
  const api = await getApi();

  const startAt = new Date();
  startAt.setMonth(startAt.getMonth() - 3, 1);
  startAt.setHours(0, 0, 0, 0);
  const limit = 50;

  const events = await api.event.getAll({ startDate: startAt, limit });

  const startAtString = [startAt.getFullYear(), startAt.getMonth() + 1, startAt.getDate()]
    .map(v => v.toString().padStart(2, "0"))
    .join("-");

  const command = `find . -type f -newermt "${startAtString}" | head -n ${limit} | xargs cat`;

  return (
    <Terminal>
      <TerminalLine>{command}</TerminalLine>
      <div className="space-y-2">
        {events.map(event => (
          <div key={event.id} className="flex justify-between">
            <div>
              <TerminalLine noPrompt className="font-bold text-lg">
                <Link href={`/events/${event.id}`}>{`[${event.type}] ${event.name}`}</Link>
              </TerminalLine>

              <TerminalLine noPrompt>地點: {event.venue}</TerminalLine>
              <TerminalLine noPrompt>時間: {event.startAt.toLocaleString("zh-TW")}</TerminalLine>

              <TerminalLine noPrompt className="text-sm">
                {event.description}
              </TerminalLine>
            </div>

            {event.lecturerImage && (
              <div>
                <Image src={event.lecturerImage} alt={event.lecturer || "講師"} width={400} height={200} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Terminal>
  );
}
