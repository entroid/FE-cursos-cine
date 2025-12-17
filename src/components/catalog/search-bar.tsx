"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    defaultValue?: string;
}

/**
 * Search bar component for catalog filtering
 * Client component that updates URL search params on input change (debounced)
 */
export function SearchBar({ defaultValue = "" }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        // Debounce search update
        const timeoutId = setTimeout(() => {
            const currentQ = searchParams.get("q") || "";

            // Don't update if value hasn't changed effectively
            if (value === currentQ) return;

            // Trigger only if 2+ chars or empty (to clear)
            if (value.length >= 2 || value.length === 0) {
                const params = new URLSearchParams(searchParams.toString());

                if (value.trim()) {
                    params.set("q", value.trim());
                } else {
                    params.delete("q");
                }

                startTransition(() => {
                    // Use replace to avoid polluting browser history while typing
                    router.replace(`/catalog?${params.toString()}`);
                });
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [value, router, searchParams]);

    return (
        <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className={`h-4 w-4 ${isPending ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex h-10 w-full border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Buscar cursos..."
            />
        </div>
    );
}
