import { NextRequest, NextResponse } from "next/server";
import { updateProgress } from "@/lib/strapi";

/**
 * PUT /api/enrollments/[id]
 * Update progress for a specific enrollment
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const enrollmentId = parseInt(params.id);

        if (isNaN(enrollmentId)) {
            return NextResponse.json(
                { error: "Invalid enrollment ID" },
                { status: 400 }
            );
        }

        // Get JWT token from Authorization header
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const jwtToken = authHeader.substring(7);

        // Parse request body
        const data = await request.json();

        // Update progress in Strapi
        const result = await updateProgress(enrollmentId, jwtToken, data);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating progress:", error);
        return NextResponse.json(
            { error: "Failed to update progress" },
            { status: 500 }
        );
    }
}
