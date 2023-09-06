import { sendEmail } from "..";
import { type Receipt } from "@prisma/client";

type onMemberJoinedProps = {
  name: string;
  receipt: Receipt;
  email: string;
};

const onMemberJoined = async ({ name, receipt, email }: onMemberJoinedProps) => {
  await sendEmail({
    to: email,
    subject: "[逢甲大學黑客社] 歡迎您加入黑客社",
    text: `${name} 你好：
你已經成為黑客社的一員，歡迎你加入黑客社的大家庭。
附件為你的電子收據，請妥善保存。

如操作中出現任何疑問或資料錯誤，請聯繫粉絲專頁。

Facebook: https://www.facebook.com/HackerSir.tw
Instagram: https://www.instagram.com/fcu_hackersir/
Discord: https://discord.gg/VCfC43Te3T
`,
    // TODO: Add attachment
    attachments: [],
  });
};

export default onMemberJoined;
