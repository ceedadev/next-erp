export function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1480px] w-full p-4 md:p-6 space-y-4 md:space-y-6 ">
      {children}
    </div>
  );
}
