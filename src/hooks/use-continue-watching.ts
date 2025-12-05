/**
 * Custom hook for "Continue Watching" feature
 * 
 * Fetches the most recently accessed enrollment for the authenticated user.
 * 
 * @example
 * ```tsx
 * function ContinueWatching() {
 *   const { enrollment, loading } = useContinueWatching();
 *   
 *   if (loading) return <Skeleton />;
 *   if (!enrollment) return null;
 *   
 *   return (
 *     <Card>
 *       <h2>{enrollment.course.title}</h2>
 *       <Progress value={enrollment.progressPercentage} />
 *     </Card>
 *   );
 * }
 * ```
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { FlattenedEnrollment } from "@/types/enrollment";

interface UseContinueWatchingReturn {
    enrollment: FlattenedEnrollment | null;
    loading: boolean;
    error: string | null;
}

export function useContinueWatching(): UseContinueWatchingReturn {
    const { data: session, status } = useSession();
    const [enrollment, setEnrollment] = useState<FlattenedEnrollment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContinueWatching() {
            if (!session?.strapiToken) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/enrollments/continue-watching", {
                    headers: {
                        Authorization: `Bearer ${session.strapiToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch continue watching");
                }

                const data = await response.json();
                setEnrollment(data.enrollment || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                console.error("Error fetching continue watching:", err);
            } finally {
                setLoading(false);
            }
        }

        if (status === "authenticated") {
            fetchContinueWatching();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [session?.strapiToken, status]);

    return {
        enrollment,
        loading,
        error,
    };
}
