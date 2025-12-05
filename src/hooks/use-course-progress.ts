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
}

interface UseCourseProgressReturn {
    updating: boolean;
    error: string | null;
    updateProgress: (currentLesson: string) => Promise<void>;
    markLessonComplete: (lessonId: string, completedLessons: string[]) => Promise<void>;
}

export function useCourseProgress({
    enrollmentId,
    courseId,
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
            if (!session?.strapiToken) return;

            // Clear previous timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            // Debounce update to avoid too many requests
            updateTimeoutRef.current = setTimeout(async () => {
                try {
                    setError(null);

                    const response = await fetch(`/api/enrollments/${enrollmentId}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${session.strapiToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            currentLesson,
                            lastAccessedAt: new Date().toISOString(),
                        }),
                    });

                    if (!response.ok) {
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
     * Mark a lesson as complete
     */
    const markLessonComplete = useCallback(
        async (lessonId: string, completedLessons: string[]) => {
            if (!session?.strapiToken) return;

            try {
                setUpdating(true);
                setError(null);

                // Ensure the current lesson is in the completed list
                const updatedCompletedLessons = Array.from(
                    new Set([...completedLessons, lessonId])
                );

                const response = await fetch(`/api/enrollments/${enrollmentId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${session.strapiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        currentLesson: lessonId,
                        completedLessons: updatedCompletedLessons,
                        lastAccessedAt: new Date().toISOString(),
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to mark lesson as complete");
                }

                // Clear video position from localStorage
                const { clearVideoPosition } = await import("@/lib/video-storage");
                clearVideoPosition(courseId, lessonId);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                console.error("Error marking lesson complete:", err);
            } finally {
                setUpdating(false);
            }
        },
        [session?.strapiToken, enrollmentId, courseId]
    );

    return {
        updating,
        error,
        updateProgress,
        markLessonComplete,
    };
}
