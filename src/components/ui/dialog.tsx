import { Fragment } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/button'
import { clsx } from "clsx"

type DialogProps = {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    variant?: 'default' | 'destructive'
    isLoading?: boolean
}

export function Dialog({
    isOpen,
    onClose,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    variant = 'default',
    isLoading = false
}: DialogProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden bg-card border border-border p-6 text-left align-middle shadow-xl transition-all">
                                <HeadlessDialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-foreground"
                                >
                                    {title}
                                </HeadlessDialog.Title>

                                {description && (
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground">
                                            {description}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        variant="primary" // Outline for cancel
                                        onClick={onClose}
                                        disabled={isLoading}
                                    >
                                        {cancelText}
                                    </Button>
                                    <Button
                                        variant={variant === 'destructive' ? 'destructive-filled' : 'primary-filled'}
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Procesando..." : confirmText}
                                    </Button>

                                </div>
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition>
    )
}
