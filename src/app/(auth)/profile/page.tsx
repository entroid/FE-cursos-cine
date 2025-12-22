import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStrapiUser, getCurrentUser } from "@/lib/strapi";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    let user;
    try {
        if (session.strapiToken) {
            user = await getCurrentUser(session.strapiToken);
        } else {
            // Fallback (unlikely if session exists)
            user = await getStrapiUser(session.user.email);
        }
    } catch (error) {
        console.error("Error fetching user for profile:", error);
        // Fallback or error page, but ideally we redirect to login if user not found despite session
        redirect("/login");
    }

    return (
        <div className="w-full py-8 px-4 md:px-8 max-w-4xl mx-auto">
            <ProfileForm user={user} />
        </div>
    )
}
