export default function DashboardPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Mis Cursos</h1>

            <section className="mb-12">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Continuar Viendo</h2>
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
                            Cine Experimental: Técnicas y Conceptos
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Unidad 3: La luz como narrativa
                        </p>

                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2 text-foreground">
                                <span>Progreso: 45%</span>
                                <span>12/28 Lecciones</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[45%]" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                Continuar Lección
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Mis Inscripciones</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                            <div className="aspect-video w-full bg-muted" />
                            <div className="p-6">
                                <h3 className="text-lg font-semibold leading-none tracking-tight text-foreground mb-4">
                                    Introducción al Misticismo en el Cine
                                </h3>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${10 * i}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">{10 * i}% Completado</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
