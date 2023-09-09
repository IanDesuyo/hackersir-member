type ErrorMessageProps = {
  title: string;
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-xl text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
