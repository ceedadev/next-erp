"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
} from "@radix-ui/react-icons";

interface PaginationControlProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  count: number;
}

export default function PaginationControl({
  hasNextPage,
  hasPrevPage,
  totalPages,
  count,
}: PaginationControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const page = searchParams.get("page") ?? 1;
  const perPage = searchParams.get("perPage") ?? 10;

  return (
    <section className="flex flex-col-reverse gap-2 md:flex-row justify-between">
      <div>
        <p>Found {count} item(s)</p>
      </div>
      <div className="flex flex-col gap-2 md:flex-row space-x-10 min-w-max">
        <div className="flex flex-row items-center space-x-2">
          <p className="text-sm w-fit">Per Page</p>
          <Select
            defaultValue={perPage.toString()}
            onValueChange={(value) => {
              router.push(`${pathName}?page=1&perPage=${value}`);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue>{perPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row justify-end items-center gap-2">
          <Button
            className="px-3"
            disabled={!hasPrevPage}
            variant={"outline"}
            onClick={() => {
              router.push(`${pathName}?page=1&perPage=${perPage}`);
            }}
          >
            <DoubleArrowLeftIcon className="w-4 h-4" />
          </Button>

          <Button
            disabled={!hasPrevPage}
            variant={"outline"}
            className="px-3"
            onClick={() => {
              router.push(
                `${pathName}?page=${Number(page) - 1}&perPage=${perPage}`
              );
            }}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <p className="mx-10">
            Page {page} of {totalPages}
          </p>
          <Button
            disabled={!hasNextPage}
            variant={"outline"}
            className="px-3"
            onClick={() => {
              router.push(
                `${pathName}?page=${Number(page) + 1}&perPage=${perPage}`
              );
            }}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            className="px-3"
            disabled={!hasNextPage}
            variant={"outline"}
            onClick={() => {
              router.push(`${pathName}?page=${totalPages}&perPage=${perPage}`);
            }}
          >
            <DoubleArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
