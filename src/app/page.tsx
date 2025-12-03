import { redirect } from "next/navigation";

export default function Home() {
  // In a real app, check session here.
  // If session, redirect to /dashboard
  // If no session, redirect to /login or landing page

  // For now, redirect to login as default entry
  redirect("/login");
}
