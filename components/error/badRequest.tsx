import ErrorMessage from ".";

const messages = ["伺服器不喜歡你傳送的資料 😥", "請勿餵食不好吃的資料 🤮"];

const BadRequest: React.FC = () => {
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return <ErrorMessage title="無效的請求" message={msg} />;
};

export default BadRequest;
