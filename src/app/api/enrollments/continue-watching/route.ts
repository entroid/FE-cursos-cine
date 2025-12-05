import { NextRequest, NextResponse } from "next/server";
import { getContinueWatching } from "@/lib/strapi";

/**
 * GET /api/enrollments/continue-watching
 * Get the most recently accessed enrollment
 */
export async function GET(request: NextRequest) {
    try {
        // Get JWT token from Authorization header
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const jwtToken = authHeader.substring(7);

        // Fetch continue watching from Strapi
        const enrollment = await getContinueWatching(jwtToken);

        return NextResponse.json({ enrollment });
    } catch (error) {
        console.error("Error fetching continue watching:", error);
        return NextResponse.json(
            { error: "Failed to fetch continue watching" },
            { status: 500 }
        );
    }
}
