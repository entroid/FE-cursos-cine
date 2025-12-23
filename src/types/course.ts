/**
 * Course Types
 * 
 * Type definitions for courses, instructors, tags, and related entities.
 * Used for catalog display, course details, and enrollment features.
 */

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Strapi Media object structure
 */
export interface StrapiMedia {
    id: number;
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
    formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
    };
}

/**
 * Course level enumeration
 */
export type CourseLevel = "beginner" | "intermediate" | "advanced";

/**
 * Course language enumeration
 */
export type CourseLanguage = "es" | "en" | "pt";

// ============================================================================
// TAG
// ============================================================================

export interface Tag {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color?: string;
}

// ============================================================================
// INSTRUCTOR
// ============================================================================

export interface Instructor {
    id: number;
    name: string;
    slug: string;
    bio?: string;
    avatar?: StrapiMedia | null;
    email?: string;
}

// ============================================================================
// COURSE SETTINGS COMPONENT
// ============================================================================

export interface CourseSettings {
    visible: boolean;
    featured: boolean;
    language: CourseLanguage;
    releaseDate?: string;
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
}

// ============================================================================
// LESSON & MODULE COMPONENTS
// ============================================================================

export interface Lesson {
    id: number;
    lessonId: string;
    title: string;
    videoUrl?: string;
    textContent?: string;
    duration?: number;
    freePreview: boolean;
    order: number;
}

export interface Module {
    id: number;
    title: string;
    description?: string;
    order: number;
    lessons: Lesson[];
}

// ============================================================================
// COURSE
// ============================================================================

/**
 * Full Course entity from Strapi
 */
export interface Course {
    id: number;
    title: string;
    slug: string;
    coverImage?: StrapiMedia | null;
    urlPresentacion?: string;
    shortDescription?: string;
    fullDescription?: string;
    instructor?: Instructor | null;
    level: CourseLevel;
    estimatedDuration: number;
    priceUsd?: number;
    priceArg: number;
    tags?: Tag[];
    modules?: Module[];
    settings?: CourseSettings;
    createdAt: string;
    updatedAt: string;
}

/**
 * Simplified course data for catalog cards
 * Contains only the fields needed for display in the catalog grid
 */
export interface CatalogCourse {
    id: number;
    title: string;
    slug: string;
    coverImage: string | null;
    shortDescription: string;
    level: CourseLevel;
    estimatedDuration: number;
    priceArg: number;
    priceUsd?: number;
    instructor: {
        name: string;
        avatar: string | null;
    } | null;
    tags: Array<{
        name: string;
        slug: string;
        color?: string;
    }>;
    featured: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Strapi courses list response
 */
export interface CoursesResponse {
    data: Course[];
    meta?: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

/**
 * Strapi single course response
 */
export interface CourseResponse {
    data: Course;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the full URL for a Strapi media asset
 */
export function getStrapiMediaUrl(media: StrapiMedia | null | undefined): string | null {
    if (!media?.url) return null;

    // If URL is already absolute, return as-is
    if (media.url.startsWith("http")) {
        return media.url;
    }

    // Otherwise, prepend Strapi URL
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    return `${strapiUrl}${media.url}`;
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}min`;
}

/**
 * Format price to display string
 * Example: 35000, "ARS" -> $35.000 ARS
 * Example: 35, "USD" -> $35 USD
 */
export function formatPrice(amount: number, currency: "USD" | "ARS" = "ARS"): string {
    const formatter = new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: true,
    });

    return `$${formatter.format(amount)} ${currency}`;
}

/**
 * Get level display label in Spanish
 */
export function getLevelLabel(level: CourseLevel | null | undefined): string {
    if (!level) return "";
    const labels: Record<CourseLevel, string> = {
        beginner: "Principiante",
        intermediate: "Intermedio",
        advanced: "Avanzado",
    };
    return labels[level];
}

/**
 * Transform a full Course into a CatalogCourse
 */
export function toCatalogCourse(course: Course): CatalogCourse {
    return {
        id: course.id,
        title: course.title || "Sin título",
        slug: course.slug || "",
        coverImage: getStrapiMediaUrl(course.coverImage),
        shortDescription: course.shortDescription || "",
        level: course.level || "beginner",
        estimatedDuration: course.estimatedDuration || 0,
        priceArg: course.priceArg || 0,
        priceUsd: course.priceUsd,
        instructor: course.instructor
            ? {
                name: course.instructor.name || "Instructor",
                avatar: getStrapiMediaUrl(course.instructor.avatar),
            }
            : null,
        tags: (course.tags || []).map((tag) => ({
            name: tag.name || "",
            slug: tag.slug || "",
            color: tag.color,
        })),
        featured: course.settings?.featured ?? false,
    };
}
