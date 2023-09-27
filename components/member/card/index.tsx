import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardQrCode } from "./client-components";
import { getServerSession } from "@/lib/auth";
import { getApi } from "@/lib/trpc/root";

type MemberCardProps = {
  userId: string;
};

const MemberCard: React.FC<MemberCardProps> = async ({ userId }) => {
  const session = await getServerSession();

  const api = await getApi();
  const studentData = await api.studentData.getByUserId({ userId });

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          黑客社 社員小卡
          {session?.member.active ? <Badge variant="default">社員</Badge> : <Badge variant="destructive">非社員</Badge>}
        </CardTitle>

        <CardDescription>請出示此畫面來證明你的身份 😎</CardDescription>
      </CardHeader>
      <CardContent>
        <CardQrCode userId={userId} />
      </CardContent>

      {studentData && (
        <CardFooter className="flex gap-1 flex-col items-start">
          <p className="text-xl">{studentData.realname}</p>
          <p>
            {studentData.school} {studentData.major}
          </p>
          <p>{studentData.studentId}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default MemberCard;
