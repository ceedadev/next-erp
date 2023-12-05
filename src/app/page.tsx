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
        <div className="grid grid-cols-1 md:grid-rows-3 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 border rounded-md shadow-sm flex flex-col h-40 p-4">
            <p className="font-semibold">Enterprise Resource Planning</p>
          </div>
          <div className="col-span-1 md:row-span-2 border rounded-md shadow-sm flex flex-col p-4 space-y-4">
            <p className="font-semibold">Activities Timeline</p>
            <Timeline />
          </div>
          <div className="col-span-1 md:row-span-1 md:col-span-2 border rounded-md shadow-sm flex p-4">
            03
          </div>
        </div>
      </Sheet>
    </main>
  );
}

function Timeline() {
  return (
    <div className="w-full">
      <div className="h-6 w-6 bg-neutral-600 rounded-full"></div>
      <div className="h-6 w-6 bg-neutral-600 rounded-full"></div>
    </div>
  );
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="container p-4 md:p-10 space-y-4 md:space-y-10 ">
      {children}
    </div>
  );
}
