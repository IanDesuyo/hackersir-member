"use client";

import { useSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

import styles from "./card.module.css";

type MemberCardProps = {
  showDetails?: boolean;
};

const MemberCard: React.FC<MemberCardProps> = ({ showDetails }) => {
  const { status, data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const code = false;

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle onClick={() => setLoading(prev => !prev)}>黑客社 社員小卡</CardTitle>
        <CardDescription>請出示此畫面來證明你的身分 😎</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "aspect-square w-full grid place-items-center rounded-xl bg-white p-2 sm:w-96",
            loading ? styles.timeout : "group"
          )}
          style={
            {
              "--delay": "165s" /* 3 minutes - 15 seconds */,
            } as React.CSSProperties
          }
        >
          <QRCodeSVG
            value={code || ""}
            className="rounded-md opacity-0 group-first:opacity-100 transition-all duration-500 ease-in-out"
            width="100%"
            height="100%"
            imageSettings={{
              src: "/static/images/logo.png",
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
          <LoadingSvg className="h-24 w-24 absolute opacity-100 group-first:opacity-0 transition-all duration-500 ease-in-out" />
        </div>
      </CardContent>
      {showDetails && <CardFooter></CardFooter>}
    </Card>
  );
};

export default MemberCard;

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
