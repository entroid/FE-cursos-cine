"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, User, Star } from "lucide-react";
import type { CatalogCourse } from "@/types/course";
import { formatDuration, formatPrice, getLevelLabel } from "@/types/course";
import { CardInteractive } from "@/components/ui/card";

interface CourseCardProps {
    course: CatalogCourse;
}

/**
 * Course card component for catalog display
 * Shows course thumbnail, title, description, price, and metadata
 */
export function CourseCard({ course }: CourseCardProps) {
    const primaryTag = course.tags[0];

    return (
        <Link href={`/course/${course.slug}`}>
            <CardInteractive>
                {/* Cover Image */}
                <div className="aspect-video w-full bg-muted relative overflow-hidden">
                    {course.coverImage ? (
                        <Image
                            src={course.coverImage}
                            alt={course.title}
                            fill
                            unoptimized
                            className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
                            <span className="text-4xl opacity-50">🎬</span>
                        </div>
                    )}

                    {/* Featured Badge */}
                    {course.featured && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                            <Star className="h-3 w-3 fill-current" />
                            Destacado
                        </div>
                    )}

                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                        <span className="rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
                            {getLevelLabel(course.level)}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    {/* Tag & Price Row */}
                    <div className="mb-3 flex items-center justify-between gap-2">
                        {primaryTag ? (
                            <span
                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors bg-muted"
                            >
                                {primaryTag.name}
                            </span>
                        ) : (
                            <span />
                        )}
                        <span className="text-base font-bold text-foreground">
                            {formatPrice(course.priceArg, "ARS")}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-light leading-none tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.shortDescription}
                    </p>

                    {/* Metadata Row */}
                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                        {/* Instructor */}
                        {course.instructor && (
                            <div className="flex items-center gap-1.5">
                                {course.instructor.avatar ? (
                                    <Image
                                        src={course.instructor.avatar}
                                        alt={course.instructor.name}
                                        width={20}
                                        height={20}
                                        unoptimized
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User className="h-4 w-4" />
                                )}
                                <span className="truncate max-w-[120px]">
                                    {course.instructor.name}
                                </span>
                            </div>
                        )}

                        {/* Duration */}
                        <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDuration(course.estimatedDuration)}</span>
                        </div>
                    </div>
                </div>
            </CardInteractive>
        </Link>
    );
}

/**
 * Skeleton loading state for CourseCard
 */
export function CourseCardSkeleton() {
    return (
        <CardInteractive className="flex flex-col animate-pulse">
            <div className="aspect-video w-full bg-muted" />
            <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex justify-between">
                    <div className="h-5 w-24 bg-muted rounded-full" />
                    <div className="h-5 w-16 bg-muted rounded" />
                </div>
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
                <div className="mt-auto flex justify-between">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                </div>
            </div>
        </CardInteractive>
    );
}
