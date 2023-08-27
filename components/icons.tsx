import { Menu, User, CreditCard, LogOut, CalendarSearch, FileSignature } from "lucide-react";
import Image, { ImageProps } from "next/image";

type LogoProps = Omit<ImageProps, "src" | "alt">;

const Logo: React.FC<LogoProps> = props => {
  return <Image src="/static/images/logo.png" alt="logo" {...props} />;
};

const Icons = {
  Logo,
  Menu,
  User,
  MemberCard: CreditCard,
  LogOut,
  Schedule: CalendarSearch,
  SignDoc: FileSignature,
};

export default Icons;
