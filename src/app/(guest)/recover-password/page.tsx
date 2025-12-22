import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RecoverPasswordPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card padding="lg" className="w-full max-w-md space-y-8">
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
                                className="relative block w-full border border-input bg-transparent px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="m@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary-filled"
                            className="w-full"
                        >
                            Enviar Instrucciones
                        </Button>
                    </div>
                </form>

                <div className="flex justify-center">
                    <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </Card>
        </div>
    )
}

