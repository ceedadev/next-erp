import Link from "next/link";

export default function MainFooter() {
  return (
    <footer className="flex flex-row justify-center items-center h-20 bg-background border-t">
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} created from{" "}
        <Link
          className="underline"
          href={"https://github.com/ceedadev/next-erp"}
        >
          Next ERP
        </Link>
        . All rights reserved.
      </p>
    </footer>
  );
}
