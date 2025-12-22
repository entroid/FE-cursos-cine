import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { CheckCircle, PlayCircle, ChevronLeft, ChevronRight, Lock } from "lucide-react"
import { getCourseBySlug } from "@/lib/strapi"
import { validateCourseAccess } from "@/lib/strapi"
import type { Course, Module, Lesson } from "@/types/course"
import { formatDuration } from "@/types/course"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CourseProgressTracker } from "@/components/course/course-progress-tracker"
import { Button } from "@/components/ui/button"

import { CourseSidebar } from "@/components/course/course-sidebar"

function sortModules(modules: Module[] | undefined): Module[] {
    if (!modules) return []
    return [...modules].sort((a, b) => a.order - b.order)
}

function sortLessons(lessons: Lesson[] | undefined): Lesson[] {
    if (!lessons) return []
    return [...lessons].sort((a, b) => a.order - b.order)
}

export default async function CoursePlayerPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ lesson?: string }>
}) {
    const { slug } = await params
    const { lesson } = await searchParams

    const course = (await getCourseBySlug(slug)) as Course | null
    if (!course) {
        notFound()
    }

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null
    const hasAccess = userId ? await validateCourseAccess(course.id, userId, session?.strapiToken as string) : false

    const orderedModules = sortModules(course.modules)
    const allLessons = orderedModules.flatMap((m) => sortLessons(m.lessons))
    const visibleLessons = hasAccess ? allLessons : allLessons.filter(l => l.freePreview)

    if (!hasAccess && visibleLessons.length === 0) {
        redirect(`/course/${slug}`)
    }

    // If no lesson parameter, redirect to current lesson or first lesson
    if (!lesson) {
        let targetLesson: string | null = null

        if (hasAccess && session?.strapiToken) {
            // Try to get user's enrollment to find current lesson
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/enrollments?filters[course][id][$eq]=${course.id}&filters[user][id][$eq]=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${session.strapiToken}`,
                    },
                    cache: "no-store",
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data.data && data.data.length > 0) {
                        const enrollment = data.data[0]
                        const currentLesson = enrollment.attributes?.currentLesson || enrollment.currentLesson
                        if (currentLesson) {
                            targetLesson = currentLesson
                        }
                    } else {
                        // No enrollment exists, create one
                        const createResponse = await fetch("/api/enrollments", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${session.strapiToken}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ courseId: course.id }),
                        })

                        if (createResponse.ok) {
                            console.log("Created enrollment for course:", course.id)
                        } else {
                            console.error("Failed to create enrollment")
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching/creating enrollment:", error)
            }
        }

        // If no current lesson found, use first available lesson
        if (!targetLesson && visibleLessons.length > 0) {
            targetLesson = visibleLessons[0].lessonId || visibleLessons[0].id.toString()
        }

        if (targetLesson) {
            redirect(`/course/${slug}/learn?lesson=${encodeURIComponent(targetLesson)}`)
        }
    }

    const currentIndex = Math.max(
        0,
        visibleLessons.findIndex((l) => (l.lessonId || l.id.toString()) === lesson)
    )
    const currentLesson = visibleLessons[currentIndex] || visibleLessons[0]
    const prevLesson = visibleLessons[currentIndex - 1]
    const nextLesson = visibleLessons[currentIndex + 1]

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
            <div className="flex-1 max-w-6xl mx-auto px-0 py-4 lg:px-12 md:pb-8">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 sm:mb-2">
                    <Link
                        href={`/course/${slug}`}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <h3 className="text-sm font-light uppercase tracking-wider">
                            {course.title}
                        </h3>
                    </Link>

                    <div className="flex gap-2">
                        {prevLesson ? (
                            <Button variant="accent" size="sm" asChild>
                                <Link
                                    href={`/course/${slug}/learn?lesson=${encodeURIComponent(prevLesson.lessonId || prevLesson.id.toString())}`}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Anterior
                                </Link>
                            </Button>
                        ) : null}
                        {nextLesson ? (
                            <Button variant="accent" size="sm" asChild>
                                <Link
                                    href={`/course/${slug}/learn?lesson=${encodeURIComponent(nextLesson.lessonId || nextLesson.id.toString())}`}
                                >
                                    Siguiente
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="mb-6 aspect-video w-full bg-black flex items-center justify-center">
                    {currentLesson?.videoUrl ? (
                        <iframe
                            src={currentLesson.videoUrl.replace('watch?v=', 'embed/').replace('youtube.com/', 'youtube-nocookie.com/embed/') + '?rel=0&showinfo=0&modestbranding=1'}
                            title={currentLesson.title}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    ) : (
                        <PlayCircle className="h-20 w-20 text-white/50" />
                    )}
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl font-light text-foreground">{currentLesson?.title || ""}</h1>
                </div>

                <div className="prose max-w-none dark:prose-invert text-foreground">
                    {currentLesson?.textContent ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: currentLesson.textContent,
                            }}
                        />
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Esta lección no tiene descripción disponible.
                        </div>
                    )}
                </div>

                {hasAccess ? (
                    <CourseProgressTracker
                        courseId={course.id}
                        courseSlug={course.slug}
                        currentLessonId={currentLesson?.lessonId || currentLesson?.id?.toString() || ""}
                        totalLessons={allLessons.length}
                        allLessonIds={allLessons.map(l => l.lessonId || l.id.toString())}
                    />
                ) : null}
            </div>

            <div className="w-full border-l border-border bg-muted/10 lg:w-80 flex flex-col ">
                {!hasAccess && (
                    <div className="border-b border-border">
                        <CourseSidebar
                            courseId={course.id}
                            slug={course.slug}
                            priceArg={course.priceArg}
                            priceUsd={course.priceUsd}
                            estimatedDuration={course.estimatedDuration}
                            level={course.level}
                            noCard
                        />
                    </div>
                )}
                <div className="flex h-14 items-center border-b border-border px-4 font-light text-foreground">
                    Contenido del Curso
                </div>
                <div className="flex-1 overflow-y-auto">
                    {orderedModules.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">
                            El contenido de este curso estará disponible próximamente.
                        </div>
                    ) : (
                        orderedModules.map((module) => (
                            <div key={module.id}>
                                <div className="bg-muted/50 px-4 py-3 text-sm font-medium text-foreground">
                                    {module.title}
                                </div>
                                <div>
                                    {sortLessons(module.lessons).map((lessonItem) => {
                                        const isLocked = !hasAccess && !lessonItem.freePreview;
                                        const isActive = (lessonItem.lessonId || lessonItem.id.toString()) === (currentLesson?.lessonId || currentLesson?.id?.toString());

                                        if (isLocked) {
                                            return (
                                                <div
                                                    key={lessonItem.id}
                                                    className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-muted-foreground/50 cursor-not-allowed"
                                                >
                                                    <Lock className="mt-0.5 h-4 w-4 text-muted-foreground/50" />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-muted-foreground/70">{lessonItem.title}</div>
                                                        <div className="text-xs text-muted-foreground/50">{lessonItem.duration ? `${formatDuration(lessonItem.duration)}` : ""}</div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        return (
                                            <Link
                                                key={lessonItem.id}
                                                href={`/course/${slug}/learn?lesson=${encodeURIComponent(lessonItem.lessonId || lessonItem.id.toString())}`}
                                                className={`flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors ${isActive
                                                    ? 'bg-accent text-primary-foreground'
                                                    : 'hover:bg-muted/50 text-foreground'
                                                    }`}
                                            >
                                                <CheckCircle className={`mt-0.5 h-4 w-4 ${isActive
                                                    ? 'text-primary-foreground'
                                                    : 'text-muted-foreground'
                                                    }`} />
                                                <div className="flex-1">
                                                    <div className={`font-medium ${isActive
                                                        ? 'text-primary-foreground'
                                                        : 'text-foreground'
                                                        }`}>{lessonItem.title}</div>
                                                    <div className={`text-xs ${isActive
                                                        ? 'text-primary-foreground/80'
                                                        : 'text-muted-foreground'
                                                        }`}>{lessonItem.duration ? `${formatDuration(lessonItem.duration)}` : ""}</div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <div className="h-[1px] w-full bg-border" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
