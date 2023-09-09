import { useId } from "react";
import { cn } from "@/lib/utils";

export type TerminalProps = {
  id?: string;
  defaultClose?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const Terminal: React.FC<TerminalProps> = ({ id, defaultClose, className, children }) => {
  const rnadId = useId();

  const _id = id || `terminal-${rnadId}`;

  return (
    <div className={className}>
      <input className="peer hidden" id={_id} type="checkbox" defaultChecked={defaultClose} />
      <div className="peer-checked:hidden p-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800 rounded-lg leading-normal overflow-hidden">
        <div className="flex gap-2">
          <label htmlFor={_id} className="h-3 w-3 bg-red-500 rounded-full" />
          <label className="h-3 w-3 bg-orange-300 rounded-full" />
          <a className="h-3 w-3 bg-green-500 rounded-full" href="https://youtu.be/dQw4w9WgXcQ" />
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
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
