import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center px-4">
            <h1 className="text-4xl font-bold text-foreground">404</h1>
            <p className="text-lg text-muted-foreground">
                La página que buscas no existe o ha sido movida.
            </p>
            <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                Volver al Inicio
            </Link>
        </div>
    )
}
