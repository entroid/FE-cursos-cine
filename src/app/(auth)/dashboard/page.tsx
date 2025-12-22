"use client";

import { useEnrollments } from "@/hooks/use-enrollments";
import { useContinueWatching } from "@/hooks/use-continue-watching";
import { useSession } from "next-auth/react";


import type { CatalogCourse } from "@/types/course";
import { formatPrice } from "@/types/course";
import Link from "next/link";
import { Card, CardInteractive } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { enrollments, loading: enrollmentsLoading, refresh: refreshEnrollments } = useEnrollments();
    const { enrollment: continueWatching, loading: continueLoading } = useContinueWatching();
    const { data: session } = useSession();


    const isLoading = enrollmentsLoading || continueLoading;



    // Filter enrollments to exclude the one shown in "Continue Watching"
    const filteredEnrollments = enrollments.filter(enrollment =>
        !continueWatching || enrollment.course.slug !== continueWatching.course.slug
    );

    const showEnrollmentsSection = isLoading || filteredEnrollments.length > 0 || enrollments.length === 0;

    return (
        <div className="w-full py-8 px-4 md:px-8">
            {/* <h1 className="mb-8 text-3xl font-bold text-foreground">Mis Cursos</h1> */}

            {/* Continue Watching Section */}
            {!continueLoading && continueWatching && (
                <section className="mb-20">
                    <div className="flex justify-center">
                        <div className="w-full max-w-lg lg:max-w-md">
                            <CardInteractive>
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
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <h3 className="text-2xl font-regular leading-none tracking-tight text-foreground group-hover:text-primary transition-colors">
                                            {continueWatching.course.title}
                                        </h3>
                                        {continueWatching.course.priceArg && (
                                            <div className="text-right shrink-0">
                                                <div className="text-sm font-bold text-foreground">
                                                    {formatPrice(continueWatching.course.priceArg, "ARS")}
                                                </div>
                                                {continueWatching.course.priceUsd && (
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {formatPrice(continueWatching.course.priceUsd, "USD")}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {continueWatching.currentLesson && (
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                                            {typeof continueWatching.currentLesson === 'string'
                                                ? continueWatching.currentLesson
                                                : continueWatching.currentLesson.title}
                                        </p>
                                    )}

                                    <div className="mt-auto mb-4">
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{ width: `${continueWatching.progressPercentage}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Progreso: {Math.round(continueWatching.progressPercentage)}%</span>
                                            <span>{continueWatching.enrollmentStatus === 'completed' ? 'Completado' : 'En progreso'}</span>
                                        </div>
                                        <Button variant="accent-filled" className="w-full" asChild>
                                            <Link
                                                href={
                                                    continueWatching.currentLesson
                                                        ? `/course/${continueWatching.course.slug}/learn?lesson=${typeof continueWatching.currentLesson === 'string'
                                                            ? continueWatching.currentLesson
                                                            : continueWatching.currentLesson.lessonId
                                                        }`
                                                        : `/course/${continueWatching.course.slug}`
                                                }
                                            >
                                                {continueWatching.currentLesson ? 'Continuar Lección' : 'Comenzar Curso'}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardInteractive>
                        </div>
                    </div>
                </section>
            )}

            {/* My Enrollments Section */}
            {
                showEnrollmentsSection && (
                    <section>
                        <h2 className="mb-4 text-xl font-light text-foreground">Continuar aprendiendo:</h2>

                        {isLoading ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {[1, 2, 3].map((i) => (
                                    <CardInteractive key={i} className="animate-pulse">
                                        <div className="aspect-video w-full bg-muted" />
                                        <div className="p-6">
                                            <div className="h-4 bg-muted rounded mb-4" />
                                            <div className="h-2 bg-muted rounded mb-2" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </CardInteractive>
                                ))}
                            </div>
                        ) : enrollments.length === 0 ? (
                            <Card padding="lg" className="text-center py-12">
                                <p className="text-muted-foreground">No tienes cursos inscritos aún.</p>
                                <Button variant="primary" className="mt-4" asChild>
                                    <Link href="/catalog">
                                        Explorar Cursos
                                    </Link>
                                </Button>
                            </Card>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {filteredEnrollments.map((enrollment) => {
                                    const imageUrl = enrollment.course.coverImage;
                                    return (
                                        <Link
                                            key={enrollment.id}
                                            href={`/course/${enrollment.course.slug}`}
                                            className="group bg-card border border-border shadow-sm overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 "
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
                                                <div className="flex items-center justify-between gap-2 mb-4">
                                                    <h3 className="text-2xl font-light leading-none tracking-tight text-foreground group-hover:text-primary transition-colors">
                                                        {enrollment.course.title}
                                                    </h3>
                                                    {enrollment.course.priceArg && (
                                                        <div className="text-right shrink-0">
                                                            <div className="text-sm font-bold text-foreground">
                                                                {formatPrice(enrollment.course.priceArg, "ARS")}
                                                            </div>
                                                            {enrollment.course.priceUsd && (
                                                                <div className="text-[10px] text-muted-foreground">
                                                                    {formatPrice(enrollment.course.priceUsd, "USD")}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${enrollment.progressPercentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Progreso: {Math.round(enrollment.progressPercentage)}%
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
                )
            }
        </div >
    );
}
