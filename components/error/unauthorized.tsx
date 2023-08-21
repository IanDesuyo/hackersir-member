import ErrorMessage from ".";

const messages = ["這個頁面過於機密, 我們要先確認可以給你看 😎"];

const Unauthorized: React.FC = () => {
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return <ErrorMessage title="請先登入" message={msg} />;
};

export default Unauthorized;
