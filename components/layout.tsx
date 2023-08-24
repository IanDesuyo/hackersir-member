import Nav from "@/components/nav";

type LayoutProps = {
  children: React.ReactNode;
};

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <Nav />
      </header>
      <div className="container pt-4">{children}</div>
    </div>
  );
};

export default DefaultLayout;
