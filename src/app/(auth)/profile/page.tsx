import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
    return (
        <div className="w-full py-8 px-4 md:px-8">
            <h1 className="mb-8 text-3xl font-light text-foreground">Mi Perfil</h1>

            <Card className="mb-8">
                <div className="p-6 border-b border-border">
                    <h3 className="text-2xl font-light leading-none tracking-tight text-foreground">
                        Información Personal
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Actualiza tus datos personales
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground">
                                Nombre
                            </label>
                            <input
                                defaultValue="Ilya"
                                className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground">
                                Apellido
                            </label>
                            <input
                                defaultValue="Silvakov"
                                className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">
                            Email
                        </label>
                        <input
                            defaultValue="ilya@example.com"
                            disabled
                            className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Button variant="primary">
                        Guardar Cambios
                    </Button>
                </div>
            </Card>

            <Card>
                <div className="p-6 border-b border-border">
                    <h3 className="text-2xl font-light leading-none tracking-tight text-foreground">
                        Seguridad
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Gestiona tu contraseña y sesiones
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <Button variant="primary">
                        Cambiar Contraseña
                    </Button>
                    <div className="h-[1px] w-full bg-border" />
                    <Button variant="destructive-filled">
                        Cerrar todas las sesiones
                    </Button>
                </div>
            </Card>
        </div>
    )
}
