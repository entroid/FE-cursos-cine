/**
 * Custom hook for managing course progress
 * 
 * Handles updating course progress, marking lessons as complete,
 * and syncing with both localStorage and Strapi backend.
 * 
 * @example
 * ```tsx
 * function CoursePlayer({ courseId, enrollmentId }) {
 *   const { updateProgress, markLessonComplete } = useCourseProgress(enrollmentId);
 *   
 *   const handleProgress = async (lessonSlug: string) => {
 *     await updateProgress(lessonSlug);
 *   };
 *   
 *   const handleComplete = async (lessonSlug: string) => {
 *     await markLessonComplete(lessonSlug);
 *   };
 * }
 * ```
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UseCourseProgressProps {
    enrollmentId: number;
    courseId: number;
    totalLessons: number;
}

interface UseCourseProgressReturn {
    updating: boolean;
    error: string | null;
    updateProgress: (currentLesson: string) => Promise<void>;
    markLessonComplete: (
        lessonId: string,
        completedLessons: string[],
        allLessonIds?: string[],
        onComplete?: () => void
    ) => Promise<boolean>;
}

export function useCourseProgress({
    enrollmentId,
    courseId,
    totalLessons,
}: UseCourseProgressProps): UseCourseProgressReturn {
    const { data: session } = useSession();
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, []);

    /**
     * Update current lesson progress (debounced)
     */
    const updateProgress = useCallback(
        async (currentLesson: string) => {
            if (!session?.strapiToken || enrollmentId === 0) {
                console.log("updateProgress early return:", {
                    hasToken: !!session?.strapiToken,
                    enrollmentId,
                    currentLesson
                });
                return;
            }

            console.log("updateProgress proceeding with:", { enrollmentId, currentLesson });

            // Clear previous timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            // Debounce update to avoid too many requests
            updateTimeoutRef.current = setTimeout(async () => {
                try {
                    setError(null);
                    console.log("Updating progress:", { enrollmentId, currentLesson });

                    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/enrollments/${enrollmentId}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${session.strapiToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            data: {
                                id: enrollmentId,
                                currentLesson,
                                lastAccessedAt: new Date().toISOString(),
                            },
                        }),
                    });

                    console.log("Progress update response:", response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("Progress update failed:", errorText);
                        throw new Error("Failed to update progress");
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Unknown error");
                    console.error("Error updating progress:", err);
                }
            }, 3000); // Debounce for 3 seconds
        },
        [session?.strapiToken, enrollmentId]
    );

    /**
     * Toggle lesson completion (mark/unmark as complete)
     * 
     * @param lessonId - The lesson ID to toggle
     * @param completedLessons - Current array of completed lesson IDs
     * @param allLessonIds - Optional array of all lesson IDs for next lesson calculation
     * @param onComplete - Optional callback to refresh UI after update
     * @returns Promise with the updated completed state
     */
    const markLessonComplete = useCallback(
        async (
            lessonId: string,
            completedLessons: string[],
            allLessonIds?: string[],
            onComplete?: () => void
        ): Promise<boolean> => {
            if (!session?.strapiToken || enrollmentId === 0) return false;

            try {
                setUpdating(true);
                setError(null);

                // Toggle: if lesson is completed, remove it; otherwise add it
                const isAlreadyCompleted = completedLessons.includes(lessonId);
                const updatedCompletedLessons = isAlreadyCompleted
                    ? completedLessons.filter(id => id !== lessonId)
                    : [...completedLessons, lessonId];

                // Determine next current lesson (first uncompleted lesson after current)
                let nextCurrentLesson = lessonId;
                if (!isAlreadyCompleted && allLessonIds && allLessonIds.length > 0) {
                    const currentIndex = allLessonIds.indexOf(lessonId);
                    // Find the next uncompleted lesson after the current one
                    for (let i = currentIndex + 1; i < allLessonIds.length; i++) {
                        if (!updatedCompletedLessons.includes(allLessonIds[i])) {
                            nextCurrentLesson = allLessonIds[i];
                            break;
                        }
                    }
                }

                // Calculate progress percentage based on completed lessons vs total lessons
                const progressPercentage = totalLessons > 0
                    ? Math.min(Math.round((updatedCompletedLessons.length / totalLessons) * 100), 100)
                    : 0;

                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/enrollments/${enrollmentId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${session.strapiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: {
                            id: enrollmentId,
                            currentLesson: nextCurrentLesson,
                            completedLessons: updatedCompletedLessons,
                            progressPercentage,
                            lastAccessedAt: new Date().toISOString(),
                        },
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to update lesson completion");
                }

                // Clear video position from localStorage when marking complete
                if (!isAlreadyCompleted) {
                    const { clearVideoPosition } = await import("@/lib/video-storage");
                    clearVideoPosition(courseId, lessonId);
                }

                // Call onComplete callback to refresh UI
                if (onComplete) {
                    onComplete();
                }

                return !isAlreadyCompleted; // Return new completed state
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                console.error("Error toggling lesson completion:", err);
                return completedLessons.includes(lessonId); // Return previous state on error
            } finally {
                setUpdating(false);
            }
        },
        [session?.strapiToken, enrollmentId, courseId, totalLessons]
    );

    return {
        updating,
        error,
        updateProgress,
        markLessonComplete,
    };
}
