"use client";

import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import LoadingSvg from "./loading";
import { api } from "@/lib/trpc/client";
import styles from "./qrcode.module.css";

type CardQrCodeProps = {
  userId: string;
};

export const CardQrCode: React.FC<CardQrCodeProps> = ({ userId }) => {
  const { data, isFetching, refetch } = api.member.getCodeByUserId.useQuery(
    { userId, aud: "card" },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 3 * 60 * 1000, // 3 minutes
    }
  );

  const refresh = () => {
    if (isFetching) {
      return;
    }

    refetch();
  };

  return (
    <div
      className={cn(
        "aspect-square w-full grid place-items-center rounded-xl bg-white p-2 sm:w-96",
        !isFetching && `group ${styles.timeout}`
      )}
      style={
        {
          "--delay": "165s" /* 3 minutes - 15 seconds */,
        } as React.CSSProperties
      }
    >
      <QRCodeSVG
        value={data?.token ?? ""}
        className="rounded-md opacity-0 group-first:opacity-100 transition-all duration-500 ease-in-out"
        width="100%"
        height="100%"
        imageSettings={{
          src: "/static/images/logo.png",
          height: 24,
          width: 24,
          excavate: true,
        }}
        onClick={refresh}
      />
      <LoadingSvg className="h-24 w-24 absolute opacity-100 group-first:opacity-0 transition-all duration-500 ease-in-out" />
    </div>
  );
};
