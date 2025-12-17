import { Suspense } from "react";
import { Search, Filter } from "lucide-react";
import { getPublishedCourses, getTags } from "@/lib/strapi";
import { CourseCard, CourseCardSkeleton } from "@/components/catalog/course-card";
import { SearchBar } from "@/components/catalog/search-bar";
import type { CatalogCourse } from "@/types/course";
import { Button } from "@/components/ui/button";

interface CatalogPageProps {
    searchParams: Promise<{
        tag?: string;
        level?: string;
        q?: string;
    }>;
}

/**
 * Catalog page - displays all published courses
 * Server Component with data fetching
 */
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
    const params = await searchParams;

    return (
        <div className="w-full py-8 px-4 md:px-8">
            {/* Header */}
            <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-light text-foreground">Catálogo</h1>
                    <p className="text-muted-foreground mt-1">
                        Explora nuestros cursos de cine y producción audiovisual
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6 ">
                {/* Search Bar */}
                <SearchBar defaultValue={params.q} />

                {/* Filters */}
                <Suspense fallback={<FiltersSkeleton />}>
                    <FiltersSection currentTag={params.tag} currentLevel={params.level} />
                </Suspense>
            </div>

            {/* Course Grid */}
            <Suspense fallback={<CourseGridSkeleton />}>
                <CourseGrid tag={params.tag} level={params.level} query={params.q} />
            </Suspense>
        </div>
    );
}

/**
 * Filters section component
 */
async function FiltersSection({
    currentTag,
    currentLevel,
}: {
    currentTag?: string;
    currentLevel?: string;
}) {
    let tags: Array<{ id: number; name: string; slug: string; color?: string }> = [];

    try {
        tags = await getTags();
    } catch (error) {
        console.error("Failed to fetch tags:", error);
    }

    const levels = [
        { value: "beginner", label: "Principiante" },
        { value: "intermediate", label: "Intermedio" },
        { value: "advanced", label: "Avanzado" },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {/* All Courses */}
            <a
                href="/catalog"
                className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium transition-colors ${!currentTag && !currentLevel
                    ? "bg-primary text-primary-foreground"
                    : "text-secondary-foreground hover:bg-primary/40"
                    }`}
            >
                Todos
            </a>

            {/* Tag Filters */}
            {tags.map((tag) => (
                <a
                    key={tag.id}
                    href={`/catalog?tag=${tag.slug}`}
                    className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium transition-colors ${currentTag === tag.slug
                        ? "bg-primary text-primary-foreground"
                        : "text-secondary-foreground hover:bg-primary/40"
                        }`}
                    style={
                        currentTag === tag.slug && tag.color
                            ? { backgroundColor: tag.color }
                            : undefined
                    }
                >
                    {tag.name}
                </a>
            ))}

            {/* Separator */}
            {tags.length > 0 && (
                <div className="mx-2 h-8 w-px bg-border self-center" />
            )}

            {/* Level Filters */}
            {levels.map((level) => (
                <a
                    key={level.value}
                    href={`/catalog?level=${level.value}`}
                    className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium transition-colors ${currentLevel === level.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-primary hover:bg-primary/40"
                        }`}
                >
                    {level.label}
                </a>
            ))}
        </div>
    );
}

/**
 * Course grid with data fetching
 */
async function CourseGrid({
    tag,
    level,
    query,
}: {
    tag?: string;
    level?: string;
    query?: string;
}) {
    let courses: CatalogCourse[] = [];
    let error: string | null = null;

    try {
        courses = await getPublishedCourses({ tag, level });

        // Filter by search query (client-side)
        if (query) {
            const normalizedQuery = query.toLowerCase().trim();
            courses = courses.filter(
                (course) =>
                    course.title.toLowerCase().includes(normalizedQuery) ||
                    course.shortDescription.toLowerCase().includes(normalizedQuery) ||
                    course.tags.some(tag => tag.name.toLowerCase().includes(normalizedQuery))
            );
        }
    } catch (e) {
        error = e instanceof Error ? e.message : "Error al cargar cursos";
        console.error("Failed to fetch courses:", e);
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-destructive/10 p-4 mb-4">
                    <Filter className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-light text-foreground mb-2">
                    Error al cargar cursos
                </h3>
                <p className="text-muted-foreground max-w-md">
                    No pudimos cargar el catálogo. Por favor, intenta de nuevo más tarde.
                </p>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-light text-foreground mb-2">
                    No hay cursos disponibles
                </h3>
                <p className="text-muted-foreground max-w-md">
                    {tag || level
                        ? "No encontramos cursos con los filtros seleccionados. Prueba con otros filtros."
                        : "Pronto agregaremos nuevos cursos al catálogo. ¡Vuelve pronto!"}
                </p>
                {(tag || level) && (
                    <Button variant="primary" className="mt-4" asChild>
                        <a href="/catalog">
                            Ver todos los cursos
                        </a>
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}

/**
 * Skeleton for filters
 */
function FiltersSkeleton() {
    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="h-8 w-20 rounded-full bg-muted animate-pulse"
                />
            ))}
        </div>
    );
}

/**
 * Skeleton for course grid
 */
function CourseGridSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="bg-card border border-border shadow-sm overflow-hidden animate-pulse"
                />
            ))}
        </div>
    );
}
