import Event from "@/components/dashboard/event";
import { getApi } from "@/lib/trpc/root";

export default async function DashboardEventPage({ params: { eventId } }: { params: { eventId: string } }) {
  const api = await getApi();

  const data = await api.event.getById({ eventId });

  return <Event eventId={eventId} initialData={data} />;
}
