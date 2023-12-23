import { CommandMenu } from "@/components/command-menu";
import UserButton from "../user-button";
import { auth } from "@/lib/auth";

export default async function MainHeader() {
  const session = await auth();
  return (
    <header className="flex flex-row items-center space-x-4 h-20 px-10 justify-between border-b">
      <p className="font-bold tracking-tight text-xl font-poppins">NEXT ERP</p>
      <div className="hidden md:flex flex-row items-center justify-evenly space-x-10">
        {session && <CommandMenu />}
        <UserButton />
      </div>
    </header>
  );
}
