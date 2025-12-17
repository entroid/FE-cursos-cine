"use client"

import { useEffect, useMemo } from "react"
import { useEnrollments } from "@/hooks/use-enrollments"
import { useCourseProgress } from "@/hooks/use-course-progress"
import { CheckCircle } from "lucide-react"

interface CourseProgressTrackerProps {
    courseId: number
    courseSlug: string
    currentLessonId: string
    totalLessons: number
    allLessonIds: string[]
}

export function CourseProgressTracker({
    courseId,
    courseSlug,
    currentLessonId,
    totalLessons,
    allLessonIds
}: CourseProgressTrackerProps) {
    const { enrollments, refresh: refreshEnrollments } = useEnrollments()
    const enrollment = useMemo(() => enrollments.find(e => e.course.id === courseId), [enrollments, courseId])

    // Always call hooks, even if we might not use them
    const { updateProgress, markLessonComplete, updating, error } = useCourseProgress({
        enrollmentId: enrollment?.id ?? 0,
        courseId,
        totalLessons,
    })

    useEffect(() => {
        if (enrollment && currentLessonId && enrollment.id > 0) {
            updateProgress(currentLessonId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enrollment?.id, currentLessonId])

    // Don't render progress tracker if no enrollment found
    if (!enrollment || enrollment.id === 0) {
        return null
    }

    const completedLessonIds = Array.isArray(enrollment.completedLessons)
        ? enrollment.completedLessons.map(l => (typeof l === "string" ? l : l.lessonId))
        : []

    const isCurrentLessonCompleted = completedLessonIds.includes(currentLessonId)

    const handleToggleComplete = async () => {
        await markLessonComplete(
            currentLessonId,
            completedLessonIds,
            allLessonIds,
            refreshEnrollments
        )
    }

    return (
        <div className="mt-4 flex items-center gap-2">
            <button
                onClick={handleToggleComplete}
                disabled={updating}
                className={`inline-flex items-center justify-center gap-2 border-2 px-3 py-2 text-sm font-light uppercase transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${isCurrentLessonCompleted
                        ? 'border-green-600 bg-green-600 text-white hover:bg-green-700 hover:border-green-700'
                        : 'border-primary bg-transparent hover:text-primary-foreground hover:bg-primary'
                    }`}
            >
                {isCurrentLessonCompleted && <CheckCircle className="h-4 w-4" />}
                {isCurrentLessonCompleted ? 'Completada' : 'Marcar como completada'}
            </button>
            {error ? (
                <span className="text-xs text-destructive">{error}</span>
            ) : null}
        </div>
    )
}
