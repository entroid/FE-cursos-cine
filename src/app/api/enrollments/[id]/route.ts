import { NextRequest, NextResponse } from "next/server";
import { updateProgress } from "@/lib/strapi";

/**
 * PUT /api/enrollments/[id]
 * Update progress for a specific enrollment
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const enrollmentId = parseInt(id);
        console.log("PUT /api/enrollments/[id] - Updating enrollment:", { enrollmentId, paramId: id });

        if (isNaN(enrollmentId)) {
            console.log("PUT /api/enrollments/[id] - Invalid enrollment ID:", id);
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
        const body = await request.json();

        // Ensure Strapi v5-compatible payload: wrap in `data` and include `id`
        const data = {
            id: enrollmentId,
            ...(body?.data ?? body ?? {}),
        };

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

