"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import {
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandDialog,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <p className="text-sm font-light">
        Quick Menu{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for anything..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => router.push("/products/add")}>
              Add Products
            </CommandItem>
            <CommandItem>Add Customers</CommandItem>
            <CommandItem>View Inventory</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Products">
            <CommandItem onSelect={() => router.push("/products")}>
              View All Products
            </CommandItem>
            <CommandItem>AB</CommandItem>
            <CommandItem>AC</CommandItem>
          </CommandGroup>
          <CommandGroup heading="B">
            <CommandItem>BA</CommandItem>
            <CommandItem>BB</CommandItem>
            <CommandItem>BC</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            {theme === "light" ? (
              <CommandItem
                onSelect={() => {
                  setTheme("dark");
                  setOpen(false);
                }}
              >
                <MoonIcon className="mr-2" />
                <span>Set to dark theme</span>
              </CommandItem>
            ) : (
              <CommandItem
                onSelect={() => {
                  setTheme("light");
                  setOpen(false);
                }}
              >
                <SunIcon className="mr-2" />
                Set to light theme
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
