/**
 * Enrollment and Progress Tracking Types
 * 
 * These types match the Strapi Enrollment API structure.
 */

/**
 * Enrollment status enum
 */
export type EnrollmentStatus = "not-started" | "in-progress" | "completed";

/**
 * Lesson reference (can be slug or object depending on Strapi populate)
 */
export interface LessonReference {
  id?: number;
  lessonId: string;
  title?: string;
}

/**
 * Course data in enrollment response
 */
export interface EnrollmentCourse {
  id: number;
  title: string;
  slug: string;
  coverImage?: string | null;
  totalLessons?: number;
}

/**
 * Enrollment attributes from Strapi
 */
export interface EnrollmentAttributes {
  enrollmentStatus: EnrollmentStatus;
  progressPercentage: number;
  currentLesson: string | LessonReference;
  completedLessons: string[] | LessonReference[];
  lastAccessedAt: string;
  enrolledAt?: string;
  completedAt?: string | null;
  totalTimeSpent?: number;
  course: {
    data: {
      id: number;
      attributes: EnrollmentCourse;
    };
  };
}

/**
 * Full enrollment object from Strapi
 */
export interface Enrollment {
  id: number;
  attributes: EnrollmentAttributes;
}

/**
 * Strapi API response for enrollments
 */
export interface EnrollmentsResponse {
  data: Enrollment[];
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
 * Strapi API response for single enrollment
 */
export interface EnrollmentResponse {
  data: Enrollment;
}

/**
 * Data to update enrollment progress
 */
export interface UpdateProgressData {
  id?: number;
  currentLesson?: string;
  completedLessons?: string[];
  lastAccessedAt?: string;
  totalTimeSpent?: number;
}

/**
 * Flattened enrollment for easier use in components
 */
export interface FlattenedEnrollment {
  id: number;
  enrollmentStatus: EnrollmentStatus;
  progressPercentage: number;
  currentLesson: string | LessonReference;
  completedLessons: string[] | LessonReference[];
  lastAccessedAt: Date;
  enrolledAt?: Date;
  completedAt?: Date | null;
  course: EnrollmentCourse & { id: number };
}
