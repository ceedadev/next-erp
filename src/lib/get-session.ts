import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  const headersList = headers();
  
  return await auth.api.getSession({
    headers: headersList,
  });
}