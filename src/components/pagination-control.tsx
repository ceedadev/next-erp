"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";

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
  const perPage = searchParams.get("perPage") ?? 10;

  return (
    <div className="flex flex-row justify-end items-center gap-2">
      <Button
        disabled={!hasPrevPage}
        variant={"outline"}
        onClick={() => {
          router.push(`${pathName}?page=1&perPage=${perPage}`);
        }}
      >
        <DoubleArrowLeftIcon />
      </Button>

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
      <p className="mx-10">
        Page {page} of {totalPages}
      </p>
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
      <Button
        disabled={!hasNextPage}
        variant={"outline"}
        onClick={() => {
          router.push(`${pathName}?page=${totalPages}&perPage=${perPage}`);
        }}
      >
        <DoubleArrowRightIcon />
      </Button>
    </div>
  );
}
