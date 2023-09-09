import { DataTable } from "../data-table";
import { columns, type UserSignin } from "./columns";

type SigninTableProps = {
  data: UserSignin[];
};

const SigninTable: React.FC<SigninTableProps> = ({ data }) => {
  return <DataTable columns={columns} data={data} />;
};

export default SigninTable;
