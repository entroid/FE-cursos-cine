export default function CheckoutPage() {
    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            <h1 className="mb-8 text-3xl font-bold text-foreground">Finalizar Compra</h1>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card rounded-xl border border-border shadow-sm">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
                                Método de Pago
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Selecciona tu forma de pago preferida
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button className="inline-flex h-24 flex-col items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                    <span className="font-bold">MercadoPago</span>
                                    <span className="text-xs text-muted-foreground">Argentina</span>
                                </button>
                                <button className="inline-flex h-24 flex-col items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                    <span className="font-bold">Stripe</span>
                                    <span className="text-xs text-muted-foreground">Internacional</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-card rounded-xl border border-border shadow-sm">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
                                Resumen
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between text-sm text-foreground">
                                <span>Curso de Cine Experimental</span>
                                <span>$49.99</span>
                            </div>
                            <div className="h-[1px] w-full bg-border" />
                            <div className="flex justify-between font-bold text-foreground">
                                <span>Total</span>
                                <span>$49.99</span>
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <button className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                Pagar Ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
