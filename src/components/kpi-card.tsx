import { cn } from "@/lib/utils";

export function KPICard({
  title,
  children,
  colSpan = 1,
  rowSpan = 1,
}: {
  title: string;
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
}) {
  return (
    <div
      className={cn(
        `md:row-span-${rowSpan.toString()}`,
        `md:col-span-${colSpan.toString()}`,
        "border rounded-md shadow-sm flex flex-col p-4"
      )}
    >
      <p className="font-semibold font-poppins">{title}</p>
      {children}
    </div>
  );
}
