"use client";
import * as React from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/lib/utils";

// Reusable Search input that modify current page url with search params
export default function SearchInput({
  placeholder = "Search...",
  className,
}: {
  placeholder?: string;
  className?: React.ComponentProps<typeof Input>["className"];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());

  const createQueryString = (name: string, value: string) => {
    params.set(name, value);
    return params.toString();
  };

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    router.push(`${pathname}?${createQueryString("search", searchValue)}`);
  }, 500);

  return (
    <Input
      type="search"
      onChange={handleSearch}
      className={className}
      placeholder={placeholder}
    />
  );
}
