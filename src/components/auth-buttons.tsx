import { signIn, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SignInButton({
  provider,
  ...props
}: {
  provider?: string;
} & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <Button {...props}>Sign In</Button>
    </form>
  );
}

export function SignOutButton({
  provider,
  ...props
}: {
  provider?: string;
} & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant={"ghost"} {...props}>
        Sign Out
      </Button>
    </form>
  );
}
