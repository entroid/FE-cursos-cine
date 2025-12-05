"use client";

import { useEnrollments } from "@/hooks/use-enrollments";
import { useContinueWatching } from "@/hooks/use-continue-watching";
import Link from "next/link";

export default function DashboardPage() {
    const { enrollments, loading: enrollmentsLoading } = useEnrollments();
    const { enrollment: continueWatching, loading: continueLoading } = useContinueWatching();

    const isLoading = enrollmentsLoading || continueLoading;

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Mis Cursos</h1>

            {/* Continue Watching Section */}
            {!continueLoading && continueWatching && (
                <section className="mb-12">
                    <h2 className="mb-4 text-xl font-semibold text-foreground">Continuar Viendo</h2>
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
                                {continueWatching.course.title}
                            </h3>
                            {continueWatching.currentLesson && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {typeof continueWatching.currentLesson === 'string'
                                        ? continueWatching.currentLesson
                                        : continueWatching.currentLesson.title}
                                </p>
                            )}

                            <div className="mt-4">
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

                            <div className="mt-6">
                                <Link
                                    href={`/courses/${continueWatching.course.slug}`}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    {continueWatching.currentLesson ? 'Continuar Lección' : 'Comenzar'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* My Enrollments Section */}
            <section>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Mis Inscripciones</h2>

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
                            href="/explore"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-4"
                        >
                            Explorar Cursos
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {enrollments.map((enrollment) => {
                            const imageUrl = enrollment.course.coverImage;
                            return (
                                <Link
                                    key={enrollment.id}
                                    href={`/courses/${enrollment.course.slug}`}
                                    className="bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={enrollment.course.title}
                                            className="aspect-video w-full object-cover"
                                        />
                                    ) : (
                                        <div className="aspect-video w-full bg-muted" />
                                    )}

                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold leading-none tracking-tight text-foreground mb-4">
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
        </div>
    );
}
