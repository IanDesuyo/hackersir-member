import { getApi } from "@/lib/trpc/root";
import { Terminal, TerminalLine } from "../terminal";

const JoinDetail: React.FC = async () => {
  const api = await getApi();
  const joinDetails = await api.join.getDetails();

  return (
    <Terminal>
      <TerminalLine>cat README.md</TerminalLine>
      <TerminalLine noPrompt>社員資格為一學年, 社費為 {joinDetails.clubFee} 元</TerminalLine>
    </Terminal>
  );
};

export default JoinDetail;
