import { NextRequest, NextResponse } from "next/server";
import {
    getUserEnrollments,
    flattenEnrollments,
} from "@/lib/strapi";

/**
 * GET /api/enrollments
 * Get all enrollments for the authenticated user
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

        const jwtToken = authHeader.substring(7); // Remove "Bearer " prefix

        // Fetch enrollments from Strapi
        const response = await getUserEnrollments(jwtToken);
        const enrollments = flattenEnrollments(response);

        return NextResponse.json({ enrollments });
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return NextResponse.json(
            { error: "Failed to fetch enrollments" },
            { status: 500 }
        );
    }
}
