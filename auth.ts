import NextAuth from "next-auth";
import { authOptions } from "@/migration/lib/auth";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
