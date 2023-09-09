"use client";

import { useEffect, useState } from "react";

type TimeCountdownProps = {
  time: Date;
  className?: string;
};

const timeDiff = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const [days, hours, minutes, seconds] = [
    Math.floor(diff / (1000 * 60 * 60 * 24)),
    Math.floor((diff / (1000 * 60 * 60)) % 24),
    Math.floor((diff / 1000 / 60) % 60),
    Math.floor((diff / 1000) % 60),
  ].map(n => n.toString().padStart(2, "0"));

  return { days, hours, minutes, seconds };
};

export const TimeCountdown: React.FC<TimeCountdownProps> = ({ time, className }) => {
  const [t, setT] = useState(() => timeDiff(time));

  useEffect(() => {
    const timer = setInterval(() => {
      setT(timeDiff(time));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [time]);

  return (
    <span
      suppressHydrationWarning
    >{`${t.days} days ${t.hours} hours ${t.minutes} minutes ${t.seconds} seconds left`}</span>
  );
};
