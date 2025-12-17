import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayCircle } from "lucide-react";

import { getCourseBySlug } from "@/lib/strapi";
import type { Course, Module, Lesson } from "@/types/course";
import { getStrapiMediaUrl, formatDuration, getLevelLabel } from "@/types/course";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { ModuleAccordion } from "@/components/course/module-accordion";
import { Card } from "@/components/ui/card";

function getYouTubeEmbedUrl(url: string): string | null {
    try {
        const parsed = new URL(url);

        if (parsed.hostname.includes("youtu.be")) {
            const id = parsed.pathname.replace("/", "");
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }

        if (parsed.hostname.includes("youtube.com")) {
            const id = parsed.searchParams.get("v");
            if (id) {
                return `https://www.youtube.com/embed/${id}`;
            }
        }

        return null;
    } catch {
        return null;
    }
}

function sortModules(modules: Module[] | undefined): Module[] {
    if (!modules) return [];
    return [...modules].sort((a, b) => a.order - b.order);
}

function sortLessons(lessons: Lesson[] | undefined): Lesson[] {
    if (!lessons) return [];
    return [...lessons].sort((a, b) => a.order - b.order);
}

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const course = (await getCourseBySlug(slug)) as Course | null;

    if (!course) {
        notFound();
    }

    const coverUrl = getStrapiMediaUrl(course.coverImage);
    const presentationUrl = course.urlPresentacion?.trim();
    const youTubeEmbedUrl = presentationUrl ? getYouTubeEmbedUrl(presentationUrl) : null;

    return (
        <div className="w-full py-8 px-4 md:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">

                    <div className="aspect-video w-full  bg-muted overflow-hidden flex items-center justify-center relative">
                        {youTubeEmbedUrl ? (
                            <iframe
                                src={youTubeEmbedUrl}
                                title={course.title}
                                className="h-full w-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        ) : coverUrl ? (
                            <Image
                                src={coverUrl}
                                alt={course.title}
                                fill
                                unoptimized
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 66vw"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <PlayCircle className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                        )}
                    </div>

                    <div>
                        {course.tags && course.tags.length > 0 ? (
                            <span className="text-xs rounded-full bg-muted text-foreground font-light inline-flex px-2.5 py-0.5 mb-4">
                                {course.tags[0].name}
                            </span>
                        ) : null}
                        <h1 className="mb-4 text-5xl font-light text-foreground">
                            {course.title}
                        </h1>
                    </div>

                    {course.fullDescription ? (
                        <section className="prose max-w-none dark:prose-invert text-foreground pb-4">
                            <h2>Descripción del curso</h2>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: course.fullDescription,
                                }}
                            />
                        </section>
                    ) : null}

                    <section className="border-t pt-8 mt-8">
                        <h2 className="mb-4 text-2xl font-light text-foreground">Contenido del Curso</h2>
                        <div className="space-y-4">
                            {sortModules(course.modules).length === 0 ? (
                                <Card padding="sm" className="text-sm text-muted-foreground">
                                    El contenido de este curso estará disponible próximamente.
                                </Card>
                            ) : (
                                sortModules(course.modules).map((module) => (
                                    <ModuleAccordion
                                        key={module.id}
                                        module={module}
                                        courseSlug={course.slug}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div>
                    <div className="sticky top-24">
                        <CourseSidebar
                            courseId={course.id}
                            slug={course.slug}
                            priceArg={course.priceArg}
                            priceUsd={course.priceUsd}
                            estimatedDuration={course.estimatedDuration}
                            level={course.level}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
