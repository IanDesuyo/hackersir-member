import { Terminal, TerminalLine, TerminalProps } from "@/components/terminal";
import { getApi } from "@/lib/trpc/root";

const notice1 = [
  "新生茶會及每次社課結束後皆可繳納社費，為使作業順利，請先填寫表單後再找事務部部員進行繳費。",
  "當事務部部員確認填表資料、繳費資訊無誤以及確認收到款項後，將立刻以 E-mail 的方式寄送社費收據。",
  "社服收據將於領取社服時寄送。",
];

const notice2 = [
  "填寫表單後，請務必確認匯款至正確的帳戶，並於填表時提供您的銀行帳戶後五碼",
  "匯款完成後，請自行保留匯款收據等相關資訊以供備查。",
  "本社確認填表資料及款項入帳無誤後，將於七天內以 E-mail 的方式寄送社費收據。",
  "若七天後未收到社費收據，請先自行線上查詢是否繳費，如有問題請聯絡黑客社粉絲專頁。",
];

const transferInfo = (president: string) => {
  return [
    "銀行: 中華郵政 (700)",
    "分行: 臺中逢甲郵局 (臺中25支)",
    `戶名: 逢甲大學黑客社${president}`,
    `帳號: 00212560942111`,
  ];
};

type JoinNoticeProps = Omit<TerminalProps, "children">;

export const JoinNotice: React.FC<JoinNoticeProps> = async props => {
  const api = await getApi();
  const joinDetails = await api.join.getDetails();

  return (
    <Terminal {...props}>
      <TerminalLine>cat README.md</TerminalLine>
      <TerminalLine noPrompt>
        本校生社費 {joinDetails.clubFee} 元, 外校生社費: {joinDetails.clubFee + 50} 元
      </TerminalLine>
      <TerminalLine>cat 實體入社注意事項.md</TerminalLine>
      {notice1.map((line, index) => (
        <TerminalLine key={index} noPrompt>
          - {line}
        </TerminalLine>
      ))}

      <TerminalLine>cat 線上入社注意事項.md</TerminalLine>
      {notice2.map((line, index) => (
        <TerminalLine key={index} noPrompt>
          - {line}
        </TerminalLine>
      ))}

      <TerminalLine>cat 匯款資訊.md</TerminalLine>
      {transferInfo(joinDetails.president).map((line, index) => (
        <TerminalLine key={index} noPrompt>
          - {line}
        </TerminalLine>
      ))}
    </Terminal>
  );
};
