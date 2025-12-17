"use client";

import Link from "next/link";
import type { CourseLevel } from "@/types/course";
import { formatDuration, formatPrice, getLevelLabel } from "@/types/course";
import { useEnrollments } from "@/hooks/use-enrollments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseSidebarProps {
    courseId: number;
    slug: string;
    priceArg: number;
    priceUsd?: number;
    estimatedDuration: number;
    level: CourseLevel;
}

export function CourseSidebar({
    courseId,
    slug,
    priceArg,
    priceUsd,
    estimatedDuration,
    level,
}: CourseSidebarProps) {
    const { enrollments, loading } = useEnrollments();

    const enrollment = enrollments.find((e) => e.course.id === courseId);

    const progress = enrollment?.progressPercentage ?? 0;
    const isCompleted = enrollment?.enrollmentStatus === "completed";

    const remainingMinutes = Math.max(
        0,
        Math.round(estimatedDuration * (1 - progress / 100))
    );

    const primaryPrice = formatPrice(priceArg, "ARS");

    return (
        <Card padding="none">
            <div className="p-6 border-b border-border space-y-2">
                {enrollment ? (
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-light inline-flex rounded-full bg-muted text-foreground px-2.5 py-0.5">
                            {getLevelLabel(level)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {isCompleted ? "Curso completado" : "En progreso"}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-baseline justify-between gap-2">
                            <h3 className="text-3xl font-bold text-foreground">
                                {primaryPrice}
                            </h3>
                            <span className="text-xs rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">
                                {getLevelLabel(level)}
                            </span>
                        </div>

                        {priceUsd ? (
                            <p className="text-xs text-muted-foreground">
                                Aproximadamente {formatPrice(priceUsd, "USD")} (USD)
                            </p>
                        ) : null}

                        <p className="text-sm text-muted-foreground">Acceso de por vida</p>
                    </>
                )}
            </div>

            <div className="p-6 space-y-4">
                {loading ? (
                    <Button variant="primary" className="w-full" disabled>
                        Cargando...
                    </Button>
                ) : enrollment ? (
                    <Button variant="accent-filled" className="w-full" asChild>
                        <Link href={`/course/${slug}/learn`}>
                            Continuar
                        </Link>
                    </Button>
                ) : (
                    <Button variant="accent-filled" className="w-full" asChild>
                        <Link href={`/checkout?course=${slug}`}>
                            Comprar Ahora
                        </Link>
                    </Button>
                )}

                <p className="text-center text-xs text-muted-foreground">
                    Garantía de devolución de 30 días
                </p>

                <div className="h-[1px] w-full bg-border" />

                <div className="space-y-3 text-sm text-foreground">
                    <div className="flex justify-between">
                        <span>Duración total</span>
                        <span className="font-medium">
                            {formatDuration(estimatedDuration)}
                        </span>
                    </div>

                    {enrollment ? (
                        <>
                            <div className="flex justify-between items-center">
                                <span>Progreso</span>
                                <span className="font-medium">
                                    {Math.round(progress)}%
                                    {isCompleted ? " (completado)" : ""}
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                />
                            </div>
                            {!isCompleted && remainingMinutes > 0 ? (
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Tiempo estimado restante</span>
                                    <span className="font-medium">
                                        {formatDuration(remainingMinutes)}
                                    </span>
                                </div>
                            ) : null}
                        </>
                    ) : null}
                </div>
            </div>
        </Card>
    );
}
