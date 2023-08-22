import Icons from "./icons";
import { Button, ButtonProps } from "./ui/button";

type IconButtonProps = ButtonProps & {
  icon: keyof typeof Icons;
};

const IconButton: React.FC<IconButtonProps> = ({ icon, children, ...props }) => {
  const Icon = Icons[icon];

  return (
    <Button {...props}>
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

export default IconButton;
