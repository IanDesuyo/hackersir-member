import { sendEmail } from "..";
import { readFileSync, createWriteStream, createReadStream } from "fs";
import PDFDocument from "pdfkit";
import type { StudentData, Receipt } from "@prisma/client";
import type { Writable } from "stream";

type onMemberJoinedProps = {
  name: string;
  studentId: string;
  receipt: Receipt;
  email: string;
};

const onMemberJoined = async ({ name, studentId, receipt, email }: onMemberJoinedProps) => {
  const filename = `${receipt.id}.pdf`;
  const file = createWriteStream(`receipt/${filename}`);

  await generateReceipt({ name, studentId, receipt }, file);

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
    attachments: [
      {
        filename,
        content: createReadStream(`receipt/${filename}`),
      },
    ],
  });
};

export default onMemberJoined;

// Generate receipt PDF

const pdfLogo = readFileSync("lib/email/templates/assets/logo.png");
const pdfStamp1 = readFileSync("lib/email/templates/assets/s1.png");
const pdfStamp2 = readFileSync("lib/email/templates/assets/s2.png");

const generateReceipt = ({ name, studentId, receipt }: Omit<onMemberJoinedProps, "email">, file: Writable) => {
  console.log("[PDF] Generating receipt", receipt.id);
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    compress: true,
    ownerPassword: "hackersir",
    font: "lib/email/templates/assets/font.ttf",
    permissions: {
      modifying: false,
      copying: false,
    },
  });
  doc.once("end", () => {
    console.log("[PDF] Receipt generated", receipt.id);
  });
  doc.pipe(file);

  doc
    .fontSize(12)
    .text("From:", 50, 50)
    .text("To:", 50, 70)
    .text("（407802）台中市西屯區文華路 100 號", 85, 50)
    .text(name, 85, 70)
    .image(pdfLogo, 400, 40, { width: 150 })
    .moveDown();

  doc
    .fillColor("#000000")
    .fontSize(20)
    .text("收據", 50, 160)
    .fontSize(12)
    .text("社員收執聯", 100, 165)
    .fontSize(10)
    .text(`開立日期: ${(receipt.paidAt || receipt.updatedAt).toLocaleDateString("zh-TW")}`, 70, 160, { align: "right" })
    .text(`收據編號: ${receipt.id}`, 70, 172, { align: "right" })
    .moveDown();

  for (const i of [185, 185 + 30, 185 + 150]) {
    doc.strokeColor("#000000").lineWidth(1).moveTo(50, i).lineTo(550, i).stroke();
  }
  for (const i of [185 + 60, 185 + 90, 185 + 120]) {
    doc.strokeColor("#000000").lineWidth(1).moveTo(50, i).lineTo(400, i).stroke();
  }

  for (const x of [50, 150, 400, 550]) {
    doc
      .strokeColor("#000000")
      .lineWidth(1)
      .moveTo(x, 185)
      .lineTo(x, 185 + 5 * 30)
      .stroke();
  }

  doc
    .fontSize(12)
    .text("姓名/抬頭", 60, 195)
    .text("學號/統一編號", 60, 225)
    .text("類別", 60, 255)
    .text("金額", 60, 285)
    .text("經辦人", 60, 315)
    .text("社團簽章", 450, 195)
    .text("未蓋印章者無效", 410, 315)
    .fillColor("#000000")
    .text(name, 160, 195)
    .text(studentId, 160, 225)
    .text(receipt.title, 160, 255)
    .text(`新台幣 ${receipt.amount} 元整`, 160, 285)
    .text("逢甲大學黑客社入社系統", 160, 315)
    .image(pdfStamp1, 400, 220, { width: 120 })
    .image(pdfStamp2, 500, 270, { width: 30 })
    .fillColor("#cccccc")
    .text("此處用印僅限本收據使用", 410, 280, {});

  doc.end();
};
