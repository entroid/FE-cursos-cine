"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Eye, EyeOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [serverError, setServerError] = useState(false)
    const [serverErrorMessage, setServerErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // Name validation (displayName in Strapi)
    const validateName = (name: string) => {
        if (!name.trim()) {
            return "El nombre es requerido"
        }
        if (name.trim().length < 2) {
            return "Mínimo 2 caracteres"
        }
        if (name.trim().length > 60) {
            return "Máximo 60 caracteres"
        }
        return ""
    }

    // Email validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            return "El email es requerido"
        }
        if (email.length < 6) {
            return "Mínimo 6 caracteres"
        }
        // Validate username part (before @) is at least 3 chars for Strapi
        const emailPrefix = email.split('@')[0]
        if (emailPrefix && emailPrefix.length < 3) {
            return "El email debe tener al menos 3 caracteres antes del @"
        }
        if (!emailRegex.test(email)) {
            return "Email inválido"
        }
        return ""
    }

    // Password validation (Frontend enforces stronger rules than Strapi)
    const validatePassword = (password: string) => {
        if (!password) {
            return "La contraseña es requerida"
        }
        if (password.length < 8) {
            return "Mínimo 8 caracteres"
        }
        if (!/[A-Z]/.test(password)) {
            return "Debe contener al menos una mayúscula"
        }
        if (!/[0-9]/.test(password)) {
            return "Debe contener al menos un número"
        }
        return ""
    }

    // Validación en submit y eventos, sin efectos

    // Check if form is valid
    const isFormValid = () => {
        return (
            name &&
            email &&
            password &&
            !validateName(name) &&
            !validateEmail(email) &&
            !validatePassword(password)
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate all fields
        const nameErr = validateName(name)
        const emailErr = validateEmail(email)
        const passwordErr = validatePassword(password)

        setNameError(nameErr)
        setEmailError(emailErr)
        setPasswordError(passwordErr)

        if (nameErr || emailErr || passwordErr) {
            return
        }

        setServerError(false)
        setLoading(true)

        try {
            // 1. Register user in Strapi (only standard fields)
            const registerResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email.split("@")[0],
                    email: email,
                    password: password,
                }),
            })

            const data = await registerResponse.json()

            if (!registerResponse.ok) {
                // Handle specific errors from Strapi
                if (data.error?.message?.includes("Email") || data.error?.message?.includes("email")) {
                    setEmailError("Este email ya está registrado")
                } else if (data.error?.message?.includes("username")) {
                    setEmailError("Este email ya está registrado")
                } else {
                    setServerErrorMessage(data.error?.message || "Error al crear la cuenta")
                    setServerError(true)
                }
                setLoading(false)
                return
            }

            // 2. Update user profile with displayName using the JWT we just got
            if (data.jwt && data.user?.id) {
                try {
                    const updateResponse = await fetch(`${STRAPI_URL}/api/users/${data.user.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${data.jwt}`,
                        },
                        body: JSON.stringify({
                            displayName: name,
                        }),
                    })

                    if (!updateResponse.ok) {
                        console.error("Failed to update display name. Status:", updateResponse.status)
                        // We don't block registration success, but we log it
                    }
                } catch (updateError) {
                    console.error("Error updating display name:", updateError)
                }
            }

            // Auto-login after successful registration
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.ok) {
                router.push("/dashboard")
                router.refresh()
            } else {
                router.push("/login")
            }
        } catch (error) {
            console.error("Error de conexión con el servidor", error)
            setServerErrorMessage("Error de conexión con el servidor")
            setServerError(true)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Server Error Popup */}
            {serverError && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card padding="md" className="max-w-md w-full relative">
                        <button
                            onClick={() => setServerError(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
                                <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                Error en el servidor
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                {serverErrorMessage || "Intente nuevamente en unos minutos."}
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => setServerError(false)}
                                className="w-full"
                            >
                                Entendido
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            <Card padding="lg" className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-4xl tracking-tight text-foreground">
                        Crear Cuenta
                    </h2>
                    <p className="mt-2 text-md text-muted-foreground">
                        Únete a la comunidad de Escuela de Cine
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="block text-md font-medium text-foreground mb-1">
                                Nombre completo
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`relative block w-full border ${nameError ? 'border-destructive' : 'border-input'
                                    } bg-transparent px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                                placeholder="Juan Pérez"
                            />
                            {nameError && (
                                <p className="mt-1 text-sm text-destructive">
                                    {nameError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email-address" className="block text-md font-medium text-foreground mb-1">
                                Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`relative block w-full border ${emailError ? 'border-destructive' : 'border-input'
                                    } bg-transparent px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                                placeholder="tu@email.com"
                            />
                            {emailError && (
                                <p className="mt-1 text-sm text-destructive">
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-md font-medium text-foreground mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`relative block w-full border ${passwordError ? 'border-destructive' : 'border-input'
                                        } bg-transparent px-3 py-2 pr-10 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-1 text-sm text-destructive">
                                    {passwordError}
                                </p>
                            )}
                            {!passwordError && password && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Mínimo 8 caracteres, una mayúscula y un número
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || !isFormValid()}
                            className="w-full"
                        >
                            {loading ? "Creando cuenta..." : "Registrarse"}
                        </Button>
                    </div>
                </form>

                <p className="mt-2 text-center text-sm text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                        Inicia Sesión
                    </Link>
                </p>
            </Card>
        </div>
    )
}
