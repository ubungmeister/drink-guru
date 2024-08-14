import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/drink");
  } else {
    redirect("/signin");
  }
}
