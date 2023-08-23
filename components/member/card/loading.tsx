import { cn } from "@/lib/utils";

type LoadingProps = {
  className?: string;
};

const LoadingSvg: React.FC<LoadingProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={cn("fill-none stroke-black", className)}
    viewBox="0 0 44 44"
    strokeWidth="2"
  >
    <circle cx="22" cy="22" r="1">
      <animate
        attributeName="r"
        begin="0s"
        dur="2.5s"
        values="1; 20"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.165, 0.84, 0.44, 1"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-opacity"
        begin="0s"
        dur="2.5s"
        values="1; 0"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.3, 0.61, 0.355, 1"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="22" cy="22" r="1">
      <animate
        attributeName="r"
        begin="1.25s"
        dur="2.5s"
        values="1; 20"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.165, 0.84, 0.44, 1"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-opacity"
        begin="1.25s"
        dur="2.5s"
        values="1; 0"
        calcMode="spline"
        keyTimes="0; 1"
        keySplines="0.3, 0.61, 0.355, 1"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default LoadingSvg;
