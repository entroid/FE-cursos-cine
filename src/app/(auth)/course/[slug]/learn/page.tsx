import { CheckCircle, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react"

export default async function CoursePlayerPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
            <div className="flex-1 overflow-y-auto bg-background p-6">
                <div className="mb-6 aspect-video w-full rounded-lg bg-black flex items-center justify-center">
                    <PlayCircle className="h-20 w-20 text-white/50" />
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">Lección Actual: Introducción</h1>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Anterior
                        </button>
                        <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            Siguiente
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="prose max-w-none dark:prose-invert text-foreground">
                    <h3>Descripción de la lección</h3>
                    <p>
                        En esta lección exploraremos los conceptos básicos del curso {slug}.
                        Prepárate para tomar notas y realizar los ejercicios prácticos.
                    </p>
                </div>
            </div>

            <div className="w-full border-l border-border bg-muted/10 lg:w-80 flex flex-col">
                <div className="flex h-14 items-center border-b border-border px-4 font-semibold text-foreground">
                    Contenido del Curso
                </div>
                <div className="flex-1 overflow-y-auto">
                    {[1, 2, 3].map((module) => (
                        <div key={module}>
                            <div className="bg-muted/50 px-4 py-3 text-sm font-medium text-foreground">
                                Módulo {module}
                            </div>
                            <div>
                                {[1, 2, 3, 4].map((lesson) => (
                                    <button
                                        key={lesson}
                                        className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-muted/50 transition-colors"
                                    >
                                        <CheckCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div className="flex-1 text-foreground">
                                            <div className="font-medium">Lección {lesson}</div>
                                            <div className="text-xs text-muted-foreground">10 min</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="h-[1px] w-full bg-border" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
