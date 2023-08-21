import ErrorMessage from ".";

const messages = ["爐心超載啦!!! 🥵", "是不是你把它玩壞 😡"];

const Forbidden: React.FC = () => {
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return <ErrorMessage title="伺服器錯誤" message={msg} />;
};

export default Forbidden;
