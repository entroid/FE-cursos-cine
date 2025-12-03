import Link from "next/link"
import { CheckCircle, PlayCircle } from "lucide-react"

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <span className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-4">
                            Cine Experimental
                        </span>
                        <h1 className="mb-4 text-4xl font-bold text-foreground">Curso de Ejemplo: {slug}</h1>
                        <p className="text-lg text-muted-foreground">
                            Aprende las técnicas fundamentales del cine experimental y expande tu conciencia creativa.
                        </p>
                    </div>

                    <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-muted-foreground/50" />
                    </div>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-foreground">Lo que aprenderás</h2>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-2 text-foreground">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    <span>Concepto clave número {i}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-foreground">Contenido del Curso</h2>
                        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                            <div className="p-0">
                                {[1, 2, 3].map((module) => (
                                    <div key={module}>
                                        <div className="bg-muted/30 p-4 font-semibold text-foreground">
                                            Módulo {module}: Fundamentos
                                        </div>
                                        <div className="divide-y divide-border">
                                            {[1, 2, 3].map((lesson) => (
                                                <div key={lesson} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                                    <div className="flex items-center gap-3 text-foreground">
                                                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                                        <span>Lección {module}.{lesson}: Título de la lección</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">10:00</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div>
                    <div className="sticky top-24 bg-card rounded-xl border border-border shadow-sm">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-3xl font-bold text-foreground">$49.99</h3>
                            <p className="text-sm text-muted-foreground mt-1">Acceso de por vida</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <Link
                                href="/checkout"
                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-lg font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Comprar Ahora
                            </Link>
                            <p className="text-center text-xs text-muted-foreground">
                                Garantía de devolución de 30 días
                            </p>
                            <div className="h-[1px] w-full bg-border" />
                            <div className="space-y-2 text-sm text-foreground">
                                <div className="flex justify-between">
                                    <span>Duración</span>
                                    <span className="font-medium">12h 30m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Nivel</span>
                                    <span className="font-medium">Intermedio</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Recursos</span>
                                    <span className="font-medium">15 descargables</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
