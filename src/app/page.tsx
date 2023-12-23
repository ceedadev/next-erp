import Link from "next/link";

export default function HomePage() {
  return (
    <main className="h-screen">
      <div className="flex flex-col justify-center items-center h-full space-y-4">
        <h1 className="text-4xl font-semibold font-poppins">
          Welcome to Next ERP
        </h1>
        <p>
          This is your Landing page, edit{" "}
          <code className="font-mono bg-muted px-2 py-1 rounded-md">
            /src/app/page.tsx
          </code>{" "}
          to customize this page.
        </p>
        <p>
          Most features are in{" "}
          <Link href={"/dashboard"} className="underline italic">
            Dashboard Route
          </Link>
        </p>
      </div>
    </main>
  );
}
