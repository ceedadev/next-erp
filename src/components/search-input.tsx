"use client";
import * as React from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter } from "next/navigation";
import { debounce } from "@/lib/utils";

// Reusable Search input that modify current page url with search params
export default function SearchInput({
  className,
}: {
  className?: React.ComponentProps<typeof Input>["className"];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = React.useState("");

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = e.target.value;
    setSearch(searchValue);
    debouncedHandleSearch(searchValue);
  }

  const debouncedHandleSearch = React.useCallback(
    debounce((search: string) => {
      setSearch(search);
      router.push(`${pathname}?search=${search}`);
    }, 500),
    [router, pathname]
  );
  return (
    <Input
      type="search"
      placeholder="Search..."
      onChange={handleSearch}
      className={className}
    />
  );
}
