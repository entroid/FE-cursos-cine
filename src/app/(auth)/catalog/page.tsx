import { Search } from "lucide-react"

export default function CatalogPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold text-foreground">Catálogo</h1>
                <div className="relative w-full md:w-72">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Buscar cursos..."
                    />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="aspect-video w-full bg-muted" />
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                    Cine Experimental
                                </span>
                                <span className="text-sm font-bold text-foreground">$49.99</span>
                            </div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight text-foreground mb-2">
                                Curso de Ejemplo {i}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Una breve descripción del curso y sus objetivos principales.
                            </p>
                            <div className="mt-auto">
                                <button className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
