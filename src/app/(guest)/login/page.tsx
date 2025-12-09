"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [serverError, setServerError] = useState(false)
    const [loading, setLoading] = useState(false)

    // Email validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            return "El email es requerido"
        }
        if (email.length < 6) {
            return "Mínimo 6 caracteres"
        }
        // Validate username part (before @) is at least 3 chars
        const emailPrefix = email.split('@')[0]
        if (emailPrefix && emailPrefix.length < 3) {
            return "El email debe tener al menos 3 caracteres antes del @"
        }
        if (!emailRegex.test(email)) {
            return "Email inválido"
        }
        return ""
    }

    // Password validation
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

    // Real-time validation
    useEffect(() => {
        if (email) {
            setEmailError(validateEmail(email))
        }
    }, [email])

    useEffect(() => {
        if (password) {
            setPasswordError(validatePassword(password))
        }
    }, [password])

    // Check if form is valid
    const isFormValid = () => {
        return (
            email &&
            password &&
            !validateEmail(email) &&
            !validatePassword(password)
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate all fields
        const emailErr = validateEmail(email)
        const passwordErr = validatePassword(password)

        setEmailError(emailErr)
        setPasswordError(passwordErr)

        if (emailErr || passwordErr) {
            return
        }

        setServerError(false)
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setPasswordError("Email o contraseña incorrectos")
            } else if (result?.ok) {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            setServerError(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Server Error Popup */}
            {serverError && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6 relative">
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
                                Intente nuevamente en unos minutos.
                            </p>
                            <button
                                onClick={() => setServerError(false)}
                                className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-sm">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Ingresa a tu cuenta para continuar aprendiendo
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-foreground mb-1">
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
                                className={`relative block w-full rounded-md border ${emailError ? 'border-destructive' : 'border-input'
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
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                    Contraseña
                                </label>
                                <div className="text-sm">
                                    <Link
                                        href="/recover-password"
                                        className="font-medium text-primary hover:text-primary/80"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`relative block w-full rounded-md border ${passwordError ? 'border-destructive' : 'border-input'
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
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || !isFormValid()}
                            className="group relative flex w-full justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Ingresando..." : "Ingresar"}
                        </button>
                    </div>
                </form>

                <p className="mt-2 text-center text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    )
}
