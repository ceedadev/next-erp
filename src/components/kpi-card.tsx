import { cn } from "@/lib/utils";

export function KPICard({
  title,
  children,
  colSpan = 1,
  rowSpan = 1,
  className,
}: {
  title: string;
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: React.HTMLProps<HTMLElement>["className"];
}) {
  return (
    <div
      className={cn(
        className,
        `md:row-span-${rowSpan.toString()}`,
        `md:col-span-${colSpan.toString()}`,
        "bg-background border rounded-md shadow-sm flex flex-col p-4 space-y-4"
      )}
    >
      <p className="font-semibold font-poppins">{title}</p>
      {children}
    </div>
  );
}
