"use client";

import { useEnrollments } from "@/hooks/use-enrollments";
import { useContinueWatching } from "@/hooks/use-continue-watching";
import Link from "next/link";

export default function DashboardPage() {
    const { enrollments, loading: enrollmentsLoading } = useEnrollments();
    const { enrollment: continueWatching, loading: continueLoading } = useContinueWatching();

    const isLoading = enrollmentsLoading || continueLoading;

    // Filter enrollments to exclude the one shown in "Continue Watching"
    const filteredEnrollments = enrollments.filter(enrollment =>
        !continueWatching || enrollment.course.slug !== continueWatching.course.slug
    );

    const showEnrollmentsSection = isLoading || filteredEnrollments.length > 0 || enrollments.length === 0;

    return (
        <div className="container mx-auto py-8 px-4">
            {/* <h1 className="mb-8 text-3xl font-bold text-foreground">Mis Cursos</h1> */}

            {/* Continue Watching Section */}
            {!continueLoading && continueWatching && (
                <section className="mb-20">
                    <h2 className="mb-4 text-xl font-semibold text-foreground">Continuar Viendo</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="group bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col destacado transition-all hover:shadow-lg hover:border-primary/50 ">
                            {continueWatching.course.coverImage ? (
                                <img
                                    src={continueWatching.course.coverImage}
                                    alt={continueWatching.course.title}
                                    className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="aspect-video w-full bg-muted" />
                            )}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-semibold leading-none tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {continueWatching.course.title}
                                </h3>
                                {continueWatching.currentLesson && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                                        {typeof continueWatching.currentLesson === 'string'
                                            ? continueWatching.currentLesson
                                            : continueWatching.currentLesson.title}
                                    </p>
                                )}

                                <div className="mt-auto mb-6">
                                    <div className="flex items-center justify-between text-sm mb-2 text-foreground">
                                        <span>Progreso: {Math.round(continueWatching.progressPercentage)}%</span>
                                        <span>{continueWatching.enrollmentStatus === 'completed' ? 'Completado' : 'En progreso'}</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${continueWatching.progressPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <Link
                                    href={`/course/${continueWatching.course.slug}`}
                                    className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    {continueWatching.currentLesson ? 'Continuar Lección' : 'Comenzar Curso'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* My Enrollments Section */}
            {showEnrollmentsSection && (
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-foreground">Más Inscripciones</h2>

                    {isLoading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-pulse">
                                    <div className="aspect-video w-full bg-muted" />
                                    <div className="p-6">
                                        <div className="h-4 bg-muted rounded mb-4" />
                                        <div className="h-2 bg-muted rounded mb-2" />
                                        <div className="h-3 bg-muted rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : enrollments.length === 0 ? (
                        <div className="text-center py-12 bg-card rounded-xl border border-border">
                            <p className="text-muted-foreground">No tienes cursos inscritos aún.</p>
                            <Link
                                href="/catalog"
                                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-4"
                            >
                                Explorar Cursos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredEnrollments.map((enrollment) => {
                                const imageUrl = enrollment.course.coverImage;
                                return (
                                    <Link
                                        key={enrollment.id}
                                        href={`/course/${enrollment.course.slug}`}
                                        className="group bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 "
                                    >
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={enrollment.course.title}
                                                className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="aspect-video w-full bg-muted" />
                                        )}

                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold leading-none tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors">
                                                {enrollment.course.title}
                                            </h3>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${enrollment.progressPercentage}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {Math.round(enrollment.progressPercentage)}% Completado
                                            </p>
                                            {enrollment.enrollmentStatus === 'completed' && (
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 mt-2">
                                                    ✓ Completado
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
