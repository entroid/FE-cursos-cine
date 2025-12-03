import Link from "next/link"

export default function RecoverPasswordPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-sm">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Recuperar Contraseña
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Ingresa tu email para recibir instrucciones
                    </p>
                </div>

                <form className="mt-8 space-y-6" action="#" method="POST">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-foreground">
                                Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="m@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Enviar Instrucciones
                        </button>
                    </div>
                </form>

                <div className="flex justify-center">
                    <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    )
}
