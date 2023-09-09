import { cn } from "@/lib/utils";

import styles from "./step.module.css";

type StepProps = {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
  children?: React.ReactNode;
};

export const Step: React.FC<StepProps> = ({ step, title, description, isCompleted, children }) => {
  return (
    <li
      className={cn("flex gap-4 relative group", styles.step)}
      id={`step${step}`}
      data-step={step}
      data-completed={isCompleted}
    >
      <span
        className={cn(
          "h-8 w-8 aspect-square items-center justify-center rounded-full font-bold flex bg-neutral-500",
          "before:absolute before:w-2 before:-z-10 before:h-[calc(100%+2rem)] before:top-4 before:bg-neutral-700 group-last:before:hidden",
          isCompleted && "bg-green-700 before:bg-green-900"
        )}
      >
        {step}
      </span>

      <div className="w-full">
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-xl font-bold">{title}</p>
          <p className="text-sm">{description}</p>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </li>
  );
};

type StepWrapperProps = {
  children: React.ReactNode;
};

export const StepWrapper: React.FC<StepWrapperProps> = ({ children }) => {
  return <ol className="grid gap-8">{children}</ol>;
};
