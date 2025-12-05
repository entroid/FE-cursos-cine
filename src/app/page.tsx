import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    // User is authenticated, redirect to dashboard
    redirect("/dashboard")
  } else {
    // User is not authenticated, redirect to login
    redirect("/login")
  }
}
