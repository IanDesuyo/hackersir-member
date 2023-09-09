"use client";

import { useEffect, useState } from "react";

/**
 * Delay the execution of function or state update with useDebounce.
 * @see https://usehooks.com/usedebounce
 */
export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
