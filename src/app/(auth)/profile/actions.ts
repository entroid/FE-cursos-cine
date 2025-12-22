"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateUser, deleteUser, uploadFile } from "@/lib/strapi";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.strapiToken) {
        return { error: "No estás autenticado" };
    }

    try {
        const token = session.strapiToken;
        const userId = parseInt(session.user.id);

        if (isNaN(userId)) {
            throw new Error("Invalid user ID in session");
        }

        // 2. Handle File Upload if present
        const file = formData.get("avatar") as File | null;
        let avatarId: number | undefined = undefined;

        if (file && file.size > 0 && file.name !== "undefined") {
            const uploadedFile = await uploadFile(file, token);
            avatarId = uploadedFile.id;
        }

        // 3. Update User
        const displayName = formData.get("displayName") as string;

        await updateUser(
            userId,
            {
                displayName,
                ...(avatarId ? { avatar: avatarId } : {}),
            },
            token
        );

        revalidatePath("/profile");

        return { success: "Perfil actualizado correctamente" };
    } catch (error: any) {
        console.error("Profile update error:", error);
        // Return only the error message to the client
        return { error: error.message || "Error al actualizar el perfil" };
    }
}

export async function deleteAccountAction() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.strapiToken) {
        throw new Error("No estás autenticado");
    }

    try {
        const token = session.strapiToken;
        const userId = parseInt(session.user.id);

        if (isNaN(userId)) {
            throw new Error("Invalid user ID");
        }

        await deleteUser(userId, token);

        return { success: true };
    } catch (error) {
        console.error("Delete account error:", error);
        throw new Error("Error al eliminar la cuenta");
    }
}
