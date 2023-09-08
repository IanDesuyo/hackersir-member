import { DataTable } from "../data-table";
import { columns, type Event } from "./columns";

type DashboardEventTableProps = {
  data: Event[];
};

const DashboardEventTable: React.FC<DashboardEventTableProps> = ({ data }) => {
  return <DataTable columns={columns} data={data} />;
};

export default DashboardEventTable;
