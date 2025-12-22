"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { updateProfileAction, deleteAccountAction } from "./actions"
import { signOut } from "next-auth/react"
import { User, Upload, Trash2, LogOut } from "lucide-react"

import { getStrapiMedia } from "@/lib/strapi"

type StrapiUser = {
    id: number
    username: string
    email: string
    displayName: string
    avatar?: {
        url: string
    } | null
}

export default function ProfileForm({ user }: { user: StrapiUser }) {
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        user.avatar?.url ? getStrapiMedia(user.avatar.url) : null
    )
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setMessage(null)

        try {
            const result = await updateProfileAction(null, formData)
            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else if (result.success) {
                setMessage({ type: 'success', text: result.success })
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Ocurrió un error inesperado" })
        } finally {
            setIsPending(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteAccountAction()
            await signOut({ callbackUrl: '/' })
        } catch (error) {
            console.error(error)
            setIsDeleting(false)
            setShowDeleteDialog(false)
            setMessage({ type: 'error', text: "Error al eliminar la cuenta" })
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="mb-8 text-3xl font-light text-foreground">Mi Perfil</h1>

            <form action={handleSubmit}>
                <Card className="mb-8">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-2xl font-light leading-none tracking-tight text-foreground">
                            Información Personal
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Actualiza tus datos personales
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        <User className="h-10 w-10" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Button
                                    type="button"
                                    variant="accent"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Cambiar Avatar
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    JPG, GIF o PNG. Máximo 2MB.
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">
                                    Nombre de Usuario (Display Name)
                                </label>
                                <input
                                    name="displayName"
                                    defaultValue={user.displayName || user.username}
                                    className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">
                                    Email
                                </label>
                                <input
                                    defaultValue={user.email}
                                    disabled
                                    className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Status Messages */}
                        {message && (
                            <div className={`p-3 text-sm rounded-md ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <Button variant="primary" type="submit" disabled={isPending}>
                            {isPending ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </Card>
            </form>

            <Card>
                <div className="p-6 border-b border-border">
                    <h3 className="text-2xl font-light leading-none tracking-tight text-foreground">
                        Sesión
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Gestiona tu acceso a la plataforma
                    </p>
                </div>
                <div className="p-6">
                    <Button
                        variant="primary"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full md:w-auto"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </Card>

            <Card className="border-destructive/30">
                <div className="p-6 border-b border-border">
                    <h3 className="text-2xl font-light leading-none tracking-tight text-destructive">
                        Zona de Peligro
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Acciones irreversibles para tu cuenta
                    </p>
                </div>
                <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">
                        Eliminar tu cuenta borrará permanentemente todos tus datos, progreso de cursos y certificados. Esta acción no se puede deshacer.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar mi cuenta
                    </Button>
                </div>
            </Card>

            <Dialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                title="¿Estás seguro?"
                description="Esta acción eliminará permanentemente tu cuenta y todo el progreso asociado. No podrás recuperar esta información."
                confirmText="Sí, eliminar cuenta"
                variant="destructive"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    )
}
