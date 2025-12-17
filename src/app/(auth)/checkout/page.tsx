import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
    return (
        <div className="w-full py-8 px-4 md:px-8">
            <h1 className="mb-8 text-3xl font-light text-foreground">Finalizar Compra</h1>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <div className="p-6 border-b border-border">
                            <h3 className="text-2xl font-light leading-none tracking-tight text-foreground">
                                Método de Pago
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Selecciona tu forma de pago preferida
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="primary" className="h-24 flex-col gap-2">
                                    <span className="font-bold">MercadoPago</span>
                                    <span className="text-xs text-muted-foreground">Argentina</span>
                                </Button>
                                <Button variant="primary" className="h-24 flex-col gap-2">
                                    <span className="font-bold">Stripe</span>
                                    <span className="text-xs text-muted-foreground">Internacional</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card>
                        <div className="p-6 border-b border-border">
                            <h3 className="text-2xl font-light leading-none tracking-tight text-foreground">
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
                            <Button variant="primary" className="w-full">
                                Pagar Ahora
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
