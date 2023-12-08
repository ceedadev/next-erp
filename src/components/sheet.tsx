export function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="container p-4 md:p-10 space-y-4 md:space-y-10 ">
      {children}
    </div>
  );
}
