export function Footer() {
    return (
        <footer className="border-t py-6 md:py-0 bg-main">
            <div className="w-full flex flex-col items-center justify-between gap-4 px-4 md:px-8 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} Escuela de Cine. Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <a href="#" className="hover:underline">Términos</a>
                    <a href="#" className="hover:underline">Privacidad</a>
                </div>
            </div>
        </footer>
    )
}
