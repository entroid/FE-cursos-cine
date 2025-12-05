/**
 * Custom hook for managing course enrollments
 * 
 * This hook provides access to the user's enrolled courses with progress tracking.
 * 
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { enrollments, loading, error, refresh } = useEnrollments();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return (
 *     <div>
 *       {enrollments.map(enrollment => (
 *         <CourseCard key={enrollment.id} enrollment={enrollment} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { FlattenedEnrollment } from "@/types/enrollment";

interface UseEnrollmentsReturn {
    enrollments: FlattenedEnrollment[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useEnrollments(): UseEnrollmentsReturn {
    const { data: session, status } = useSession();
    const [enrollments, setEnrollments] = useState<FlattenedEnrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEnrollments = useCallback(async () => {
        if (!session?.strapiToken) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/enrollments", {
                headers: {
                    Authorization: `Bearer ${session.strapiToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch enrollments");
            }

            const data = await response.json();
            setEnrollments(data.enrollments || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Error fetching enrollments:", err);
        } finally {
            setLoading(false);
        }
    }, [session?.strapiToken]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchEnrollments();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status, fetchEnrollments]);

    return {
        enrollments,
        loading,
        error,
        refresh: fetchEnrollments,
    };
}
