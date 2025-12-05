/**
 * Strapi API Utilities
 * 
 * This module provides helper functions to interact with Strapi backend.
 * These utilities follow the official Strapi documentation recommendations
 * for Next.js integration with NextAuth.
 * 
 * @see https://docs.strapi.io
 */

import type {
    EnrollmentsResponse,
    EnrollmentResponse,
    UpdateProgressData,
    FlattenedEnrollment,
    Enrollment,
} from "@/types/enrollment";

import type {
    Course,
    CoursesResponse,
    CourseResponse,
    CatalogCourse,
} from "@/types/course";

import { toCatalogCourse, getStrapiMediaUrl } from "@/types/course";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Get the full URL of a Strapi media asset
 * 
 * @param url - The relative URL from Strapi (e.g. /uploads/image.jpg)
 * @returns The full URL including domain
 */
export function getStrapiMedia(url: string | null | undefined): string | null {
    if (url == null) {
        return null;
    }

    // Return the URL if it is already absolute (e.g. from Cloudinary)
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }

    // Otherwise prepend the Strapi URL
    return `${STRAPI_URL}${url}`;
}

/**
 * Strapi User type definition
 */
export interface StrapiUser {
    id: number;
    username: string;
    email: string;
    displayName: string;
    avatar?: {
        url: string;
    } | null;
    courses: Array<{
        id: number;
        title: string;
        slug: string;
        coverImage?: {
            url: string;
        };
    }>;
}

/**
 * Get current user data from Strapi by email
 * Uses API Token for server-side authentication
 * 
 * @param email - User's email address
 * @returns Promise with Strapi user data
 * @throws Error if the request fails
 * 
 * @example
 * ```ts
 * const user = await getStrapiUser("user@example.com");
 * console.log(user.displayName);
 * ```
 */
export async function getStrapiUser(email: string): Promise<StrapiUser> {
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }

    return response.json();
}

/**
 * Validate user access to a course
 * 
 * @param courseId - The course ID to validate access for
 * @param userId - The user ID to check access
 * @returns Promise with boolean indicating if user has access
 * @throws Error if the validation request fails
 * 
 * @example
 * ```ts
 * const hasAccess = await validateCourseAccess(123, 456);
 * if (hasAccess) {
 *   // Allow user to view course
 * }
 * ```
 */
export async function validateCourseAccess(
    courseId: number,
    userId: number
): Promise<boolean> {
    const response = await fetch(
        `${STRAPI_URL}/api/enrollment/validate-access?courseId=${courseId}&userId=${userId}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to validate access");
    }

    const data = await response.json();
    return data.hasAccess;
}

/**
 * Register a new user in Strapi
 * 
 * @param data - User registration data
 * @returns Promise with registered user data and JWT
 * @throws Error if registration fails
 * 
 * @example
 * ```ts
 * const result = await registerUser({
 *   username: "johndoe",
 *   email: "john@example.com",
 *   password: "SecurePass123",
 *   displayName: "John Doe"
 * });
 * console.log(result.jwt);
 * ```
 */
export async function registerUser(data: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
}): Promise<{ jwt: string; user: StrapiUser }> {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            displayName: data.displayName || "Alumno",
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Registration failed");
    }

    return response.json();
}

/**
 * Login user to Strapi using email and password
 * 
 * @param identifier - User's email or username
 * @param password - User's password
 * @returns Promise with user data and JWT token
 * @throws Error if login fails
 * 
 * @example
 * ```ts
 * const result = await loginUser("user@example.com", "password123");
 * console.log(result.user.displayName);
 * ```
 */
export async function loginUser(
    identifier: string,
    password: string
): Promise<{ jwt: string; user: StrapiUser }> {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
        throw new Error("Invalid credentials");
    }

    return response.json();
}

/**
 * Check if a user exists in Strapi by email
 * 
 * @param email - Email to search for
 * @returns Promise with array of matching users (empty if none found)
 * @throws Error if the request fails
 * 
 * @example
 * ```ts
 * const users = await findUserByEmail("user@example.com");
 * const userExists = users.length > 0;
 * ```
 */
export async function findUserByEmail(email: string): Promise<any[]> {
    const response = await fetch(
        `${STRAPI_URL}/api/users?filters[email][$eq]=${email}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to search for user");
    }

    return response.json();
}

/**
 * Create a new user in Strapi (Admin operation)
 * Requires STRAPI_API_TOKEN
 * 
 * @param userData - User data to create
 * @returns Promise with created user data
 * @throws Error if creation fails
 * 
 * @example
 * ```ts
 * const user = await createStrapiUser({
 *   username: "newuser",
 *   email: "newuser@example.com",
 *   displayName: "New User",
 *   password: crypto.randomUUID(),
 *   confirmed: true,
 *   blocked: false
 * });
 * ```
 */
export async function createStrapiUser(userData: {
    username: string;
    email: string;
    displayName: string;
    password: string;
    confirmed: boolean;
    blocked: boolean;
}): Promise<any> {
    const response = await fetch(`${STRAPI_URL}/api/users`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Failed to create user");
    }

    return response.json();
}

// ============================================================================
// ENROLLMENT & PROGRESS TRACKING
// ============================================================================

/**
 * Get all enrollments for the authenticated user
 * 
 * @param jwtToken - User's JWT token from NextAuth session
 * @returns Promise with array of enrollments
 * @throws Error if the request fails
 * 
 * @example
 * ```ts
 * const enrollments = await getUserEnrollments(session.strapiToken);
 * console.log(enrollments.data);
 * ```
 */
export async function getUserEnrollments(
    jwtToken: string
): Promise<EnrollmentsResponse> {
    const response = await fetch(`${STRAPI_URL}/api/enrollments?populate[course][populate]=*`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch enrollments");
    }

    return response.json();
}

/**
 * Update progress for a specific enrollment
 * 
 * @param enrollmentId - The enrollment ID to update
 * @param jwtToken - User's JWT token
 * @param data - Progress data to update
 * @returns Promise with updated enrollment
 * @throws Error if the request fails
 * 
 * @example
 * ```ts
 * await updateProgress(123, token, {
 *   currentLesson: "montaje-basico",
 *   completedLessons: ["intro", "historia"],
 *   lastAccessedAt: new Date().toISOString()
 * });
 * ```
 */
export async function updateProgress(
    enrollmentId: number,
    jwtToken: string,
    data: UpdateProgressData
): Promise<EnrollmentResponse> {
    const response = await fetch(
        `${STRAPI_URL}/api/enrollments/${enrollmentId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update progress");
    }

    return response.json();
}

/**
 * Get the most recently accessed enrollment (for "Continue Watching")
 * 
 * @param jwtToken - User's JWT token
 * @returns Promise with the most recent enrollment or null
 * @throws Error if the request fails
 * 
 * @example
 * ```ts
 * const recentEnrollment = await getContinueWatching(session.strapiToken);
 * if (recentEnrollment) {
 *   console.log("Continue watching:", recentEnrollment.course.title);
 * }
 * ```
 */
export async function getContinueWatching(
    jwtToken: string
): Promise<FlattenedEnrollment | null> {
    const response = await fetch(
        `${STRAPI_URL}/api/enrollments/continue-watching`,
        {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch continue watching");
    }

    const data = await response.json();
    return data.data ? flattenEnrollment(data.data) : null;
}

/**
 * Flatten a Strapi enrollment response for easier use
 * Supports both Strapi v4 (nested attributes) and v5 (flat) structure
 * 
 * @param enrollment - Raw enrollment from Strapi
 * @returns Flattened enrollment object
 */
export function flattenEnrollment(enrollment: Enrollment | any): FlattenedEnrollment {
    // Support both Strapi v4 (with attributes) and v5 (flat structure)
    const attrs = enrollment.attributes || enrollment;
    const courseData = attrs.course?.data || attrs.course;
    const courseAttrs = courseData?.attributes || courseData;

    return {
        id: enrollment.id,
        enrollmentStatus: attrs.enrollmentStatus,
        progressPercentage: attrs.progressPercentage || 0,
        currentLesson: attrs.currentLesson,
        completedLessons: attrs.completedLessons || [],
        lastAccessedAt: new Date(attrs.lastAccessedAt),
        enrolledAt: attrs.enrolledAt
            ? new Date(attrs.enrolledAt)
            : undefined,
        completedAt: attrs.completedAt
            ? new Date(attrs.completedAt)
            : null,
        course: {
            id: courseData?.id || 0,
            title: courseAttrs?.title || "",
            slug: courseAttrs?.slug || "",
            coverImage: getStrapiMediaUrl(courseAttrs?.coverImage),
            totalLessons: courseAttrs?.totalLessons,
        },
    };
}

/**
 * Flatten all enrollments from Strapi response
 * 
 * @param response - Enrollments response from Strapi
 * @returns Array of flattened enrollments
 */
export function flattenEnrollments(
    response: EnrollmentsResponse
): FlattenedEnrollment[] {
    return response.data.map(flattenEnrollment);
}

// ============================================================================
// CATALOG & COURSES
// ============================================================================

/**
 * Get all published (visible) courses for the catalog
 * 
 * @param options - Optional query parameters
 * @returns Promise with array of catalog courses
 * @throws Error if the request fails
 */
export async function getPublishedCourses(options?: {
    featured?: boolean;
    tag?: string;
    level?: string;
    limit?: number;
}): Promise<CatalogCourse[]> {
    const params = new URLSearchParams();

    // Note: Strapi v5 may not support filtering on component fields
    // We filter client-side for visibility/featured

    if (options?.tag) {
        params.append("filters[tags][slug][$eq]", options.tag);
    }
    if (options?.level) {
        params.append("filters[level][$eq]", options.level);
    }

    // Use simple populate syntax for Strapi v5 compatibility
    params.append("populate", "*");
    params.append("sort[0]", "createdAt:desc");

    const url = `${STRAPI_URL}/api/courses?${params.toString()}`;

    const response = await fetch(url, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Strapi error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch courses: ${response.status}`);
    }

    const data: CoursesResponse = await response.json();

    // Filter for visible courses (default to visible if settings is null)
    let courses = data.data
        .filter(course => course.settings?.visible !== false)
        .map(toCatalogCourse);

    if (options?.featured) {
        courses = courses.filter(c => c.featured);
    }

    if (options?.limit && courses.length > options.limit) {
        courses = courses.slice(0, options.limit);
    }

    return courses;
}

/**
 * Get a single course by slug
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
    const params = new URLSearchParams();
    params.append("filters[slug][$eq]", slug);
    params.append("populate", "deep");

    const response = await fetch(
        `${STRAPI_URL}/api/courses?${params.toString()}`,
        { next: { revalidate: 60 } }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch course");
    }

    const data: CoursesResponse = await response.json();
    return data.data.length > 0 ? data.data[0] : null;
}

/**
 * Get featured courses for homepage
 */
export async function getFeaturedCourses(limit: number = 3): Promise<CatalogCourse[]> {
    return getPublishedCourses({ featured: true, limit });
}

/**
 * Get all available tags
 */
export async function getTags(): Promise<Array<{ id: number; name: string; slug: string; color?: string }>> {
    const response = await fetch(`${STRAPI_URL}/api/tags`, {
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tags");
    }

    const data = await response.json();
    return data.data;
}
