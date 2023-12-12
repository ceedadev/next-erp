"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface PaginationControlProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

export default function PaginationControl({
  hasNextPage,
  hasPrevPage,
  totalPages,
}: PaginationControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const page = searchParams.get("page") ?? 1;
  const perPage = searchParams.get("perPage") ?? 5;

  return (
    <div className="flex flex-row justify- items-center gap-2">
      <Button
        disabled={!hasPrevPage}
        variant={"outline"}
        onClick={() => {
          router.push(
            `${pathName}?page=${Number(page) - 1}&perPage=${perPage}`
          );
        }}
      >
        <ChevronLeftIcon />
      </Button>
      <div className="mx-10">
        {page} / {totalPages}
      </div>
      <Button
        disabled={!hasNextPage}
        variant={"outline"}
        onClick={() => {
          router.push(
            `${pathName}?page=${Number(page) + 1}&perPage=${perPage}`
          );
        }}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
