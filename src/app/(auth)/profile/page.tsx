export default function ProfilePage() {
    return (
        <div className="container mx-auto max-w-2xl py-8 px-4">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Mi Perfil</h1>

            <div className="mb-8 bg-card rounded-xl border border-border shadow-sm">
                <div className="p-6 border-b border-border">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
                        Información Personal
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Actualiza tus datos personales
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                Nombre
                            </label>
                            <input
                                defaultValue="Ilya"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                                Apellido
                            </label>
                            <input
                                defaultValue="Silvakov"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                            Email
                        </label>
                        <input
                            defaultValue="ilya@example.com"
                            disabled
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        Guardar Cambios
                    </button>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="p-6 border-b border-border">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
                        Seguridad
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Gestiona tu contraseña y sesiones
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        Cambiar Contraseña
                    </button>
                    <div className="h-[1px] w-full bg-border" />
                    <button className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2">
                        Cerrar todas las sesiones
                    </button>
                </div>
            </div>
        </div>
    )
}
