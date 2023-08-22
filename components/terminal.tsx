import { cn } from "@/lib/utils";

type TerminalProps = {
  className?: string;
  children: React.ReactNode;
};

export const Terminal: React.FC<TerminalProps> = ({ className, children }) => {
  return (
    <>
      <input className="peer hidden" id="terminal" type="checkbox" />
      <div
        className={cn(
          "peer-checked:hidden p-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800 rounded-lg leading-normal overflow-hidden",
          className
        )}
      >
        <div className="flex gap-2">
          <label htmlFor="terminal" className="h-3 w-3 bg-red-500 rounded-full" />
          <label className="h-3 w-3 bg-orange-300 rounded-full" />
          <a className="h-3 w-3 bg-green-500 rounded-full" href="https://youtu.be/dQw4w9WgXcQ" />
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </>
  );
};

type TerminalLineProps = {
  noPrompt?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const TerminalLine: React.FC<TerminalLineProps> = ({ noPrompt, className, children }) => {
  return (
    <p
      className={cn(
        "break-all",
        className,
        noPrompt || "before:text-green-400 before:pr-2 before:content-['hackersir~$']"
      )}
    >
      {children}
    </p>
  );
};
