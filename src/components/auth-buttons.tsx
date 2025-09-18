"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignInButton({
  ...props
}: React.ComponentPropsWithRef<typeof Button>) {
  const router = useRouter();
  
  return (
    <Button {...props} onClick={() => router.push("/signin")}>
      Sign In
    </Button>
  );
}

export function SignOutButton({
  ...props
}: React.ComponentPropsWithRef<typeof Button>) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
    <Button variant={"ghost"} {...props} onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
