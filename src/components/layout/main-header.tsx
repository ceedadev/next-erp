import { CommandMenu } from "@/components/command-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MainHeader() {
  return (
    <header className="flex flex-row items-center space-x-4 h-20 px-10 justify-between border-b">
      <p className="font-bold tracking-tight text-xl font-poppins">NEXT ERP</p>
      <div className="hidden md:flex flex-row items-center justify-evenly space-x-10">
        <CommandMenu />
        <Avatar>
          <AvatarImage src="https://avatars.githubusercontent.com/u/25190563?v=4" />
          <AvatarFallback>TT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
