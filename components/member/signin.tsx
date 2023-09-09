import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type RouterOutputs } from "@/lib/trpc/root";

import SigninTable from "../data-table/signin/table";

type SigninProps = {
  userId: "me" | string;
  initialData: NonNullable<RouterOutputs["signin"]["getByUserId"]>;
};

const MemberSignin: React.FC<SigninProps> = ({ userId, initialData }) => {
  return (
    <Card id="signin">
      <CardHeader>
        <CardTitle>簽到記錄</CardTitle>
      </CardHeader>

      <CardContent>
        <SigninTable data={initialData} />
      </CardContent>
    </Card>
  );
};

export default MemberSignin;
