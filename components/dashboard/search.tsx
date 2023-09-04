import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/client-utils";

type DashboardSearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: ("userId" | "studentId" | "realname")[];
  className?: string;
};

const DashboardSearch: React.FC<DashboardSearchProps> = ({ search, open, onOpenChange, className }) => {
  const router = useRouter();
  const [queryState, setQuery] = useState("");
  const query = useDebounce(queryState, 500);

  const { data, isLoading } = api.dashboard.search.useQuery(
    { query, search },
    {
      enabled: open && query.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  });

  const handleQueryChange = (query: string) => {
    setQuery(query);
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    setQuery("");
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn("relative w-full justify-between text-sm text-muted-foreground md:w-40 lg:w-64", className)}
        onClick={() => onOpenChange(true)}
      >
        <span className="inline-flex">搜尋...</span>
        <kbd className="items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput placeholder={`搜尋 ${search.join(", ")}`} onValueChange={handleQueryChange} />
        <CommandList>
          <CommandEmpty>{isLoading ? "正在搜尋..." : "No results found."}</CommandEmpty>
          <CommandGroup heading="功能選單">
            {[
              { label: "社員管理", value: "社員管理 members", onSelect: () => router.push("/dashboard/members") },
              { label: "收據管理", value: "收據管理 receipts", onSelect: () => router.push("/dashboard/receipts") },
              { label: "活動管理", value: "活動管理 events", onSelect: () => router.push("/dashboard/events") },
              { label: "系統設定", value: "系統設定 settings", onSelect: () => router.push("/dashboard/settings") },
            ].map(({ label, value, onSelect }) => (
              <CommandItem key={value} value={value} onSelect={onSelect}>
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />

          {data?.map(({ title, data }) => (
            <CommandGroup key={title} heading={title}>
              {data.map(({ id, label, href }) => (
                <CommandItem key={id} value={`${id}_${label}`} onSelect={() => router.push(href)}>
                  {label} ({id})

                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default DashboardSearch;
