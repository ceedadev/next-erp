"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  addDays,
  subDays,
  format,
  sub,
  subWeeks,
  startOfMonth,
} from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  function handleTimePresetChange(value: string) {
    const now = new Date();
    let from: Date;
    switch (value) {
      case "week":
        from = subWeeks(now, 1);
        break;
      case "month-to-date":
        from = startOfMonth(now);
        break;
      case "30-days":
        from = subDays(now, 30);
        break;
      case "90-days":
        from = subDays(now, 90);
        break;
      default:
        from = now;
    }

    setDate({ from, to: now });
  }

  function onDateChange(date: DateRange) {
    const params = new URLSearchParams(searchParams);
    params.set("from", format(date.from!, "yyyy-MM-dd"));
    params.set("to", format(date.to!, "yyyy-MM-dd"));
    router.push(`${pathName}?${params.toString()}`);
  }
  //   check on date if from and to is not undefined, then update the query params
  React.useEffect(() => {
    if (date?.from && date?.to) {
      onDateChange(date);
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-64 justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex-col space-y-2 p-2" align="start">
          <Select onValueChange={handleTimePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder={"Select Time Range"} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month-to-date">Month to Date</SelectItem>
              <SelectItem value="30-days">Last 30 Days</SelectItem>
              <SelectItem value="90-days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
