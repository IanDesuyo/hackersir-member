import ErrorMessage from ".";

const messages = ["嗶嗶, 你沒有權限 🤖", "你沒權限 ㄏㄏ", "你是誰? 你想幹嘛? 為什麼我要給你看?", "你幹嘛, 我有說你可以來這裡嗎? 😡"];

const Forbidden: React.FC = () => {
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return <ErrorMessage title="權限不足" message={msg} />;
};

export default Forbidden;
