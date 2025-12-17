import { NextRequest, NextResponse } from "next/server";
import {
    getUserEnrollments,
    flattenEnrollments,
} from "@/lib/strapi";

/**
 * GET /api/enrollments
 * Get all enrollments for authenticated user
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

/**
 * POST /api/enrollments
 * Create a new enrollment
 */
export async function POST(request: NextRequest) {
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

        // Parse request body
        const body = await request.json();
        const { courseId } = body;

        console.log("POST /api/enrollments - Creating enrollment:", { courseId });

        if (!courseId) {
            return NextResponse.json(
                { error: "Course ID is required" },
                { status: 400 }
            );
        }

        // Create enrollment in Strapi
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/enrollments`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    course: courseId,
                    enrollmentStatus: "in-progress",
                    progressPercentage: 0,
                    currentLesson: "",
                    completedLessons: [],
                    lastAccessedAt: new Date().toISOString(),
                },
            }),
        });

        console.log("POST /api/enrollments - Strapi response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error creating enrollment:", errorText);
            return NextResponse.json(
                { error: "Failed to create enrollment", details: errorText },
                { status: response.status }
            );
        }

        const result = await response.json();
        console.log("POST /api/enrollments - Created enrollment:", result);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating enrollment:", error);
        return NextResponse.json(
            { error: "Failed to create enrollment" },
            { status: 500 }
        );
    }
}
