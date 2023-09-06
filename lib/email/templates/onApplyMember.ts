import { sendEmail } from "..";

type onApplyMemberProps = {
  name: string;
  email: string;
};

const onApplyMember = async ({ name, email }: onApplyMemberProps) => {
  await sendEmail({
    to: email,
    subject: "[逢甲大學黑客社] 已收到您的入社申請",
    text: `${name} 你好：
感謝你對黑客社的支持，
社團已經收到了你所填寫的入社申請，
請再次確認您所填寫的資料無誤，並於新生茶會或社課時間完成入社手續。

如操作中出現任何疑問或資料錯誤，請聯繫粉絲專頁。

Facebook: https://www.facebook.com/HackerSir.tw
Instagram: https://www.instagram.com/fcu_hackersir/
Discord: https://discord.gg/VCfC43Te3T
`,
  });
};

export default onApplyMember;
