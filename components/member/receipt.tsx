import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type RouterOutputs } from "@/lib/trpc/root";

import ReceiptTable from "../data-table/receipt/table";

type StudentDataProps = {
  userId: "me" | string;
  initialData: NonNullable<RouterOutputs["receipt"]["getByUserId"]>;
};

const MemberReceipt: React.FC<StudentDataProps> = ({ userId, initialData }) => {
  return (
    <Card id="receipt">
      <CardHeader>
        <CardTitle>收據</CardTitle>
      </CardHeader>

      <CardContent>
        <ReceiptTable data={initialData} />
      </CardContent>
    </Card>
  );
};

export default MemberReceipt;
