import * as React from "react";

export default function Home() {
  return (
    <main className="">
      <Sheet>
        <div>
          <p className="text-muted-foreground text-sm">
            {new Date().toDateString()}
          </p>
          <p className="text-2xl font-semibold">Welcome Back, Armanda</p>
        </div>
      </Sheet>
    </main>
  );
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="container p-4 md:p-10 space-y-4 md:space-y-10 ">
      {children}
    </div>
  );
}
