// Example protected route with auth

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = auth((req) => {
  if (req.auth) {
    return NextResponse.json(
      { message: "This is protected data" },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: "Not authorized" }, { status: 401 });
}) as any;
