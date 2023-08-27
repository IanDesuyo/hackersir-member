import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LoginErrorProps = {
  error: string;
};

const LoginError: React.FC<LoginErrorProps> = ({ error }) => {
  return (
    <Alert variant="destructive">
      <AlertTitle>登入失敗</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default LoginError;
