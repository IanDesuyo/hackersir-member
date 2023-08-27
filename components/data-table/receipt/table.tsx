import { DataTable } from "../data-table";
import { columns, type Receipt } from "./columns";

type ReceiptTableProps = {
  data: Receipt[];
};

const ReceiptTable: React.FC<ReceiptTableProps> = ({ data }) => {
  return <DataTable columns={columns} data={data} />;
};

export default ReceiptTable;
