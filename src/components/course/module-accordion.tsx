"use client";

import { useState } from "react";
import { ChevronDown, Play, Lock } from "lucide-react";
import type { Module, Lesson } from "@/types/course";
import { formatDuration } from "@/types/course";

interface ModuleAccordionProps {
    module: Module;
    courseSlug: string;
}

export function ModuleAccordion({ module, courseSlug }: ModuleAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className="border border-border overflow-hidden bg-card">
            <button
                onClick={toggle}
                className="w-full bg-background p-4 font-semibold text-foreground flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
                <span>{module.title}</span>
                <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && module.description ? (
                <div className="px-4 pt-2 pb-2 bg-background text-xs font-normal text-muted-foreground">
                    {module.description.length > 200
                        ? module.description.slice(0, 200).trim() + "..."
                        : module.description}
                </div>
            ) : null}

            {isOpen && (
                <div className="divide-y divide-border border-t">
                    {module.lessons?.length ? (
                        module.lessons
                            .sort((a, b) => a.order - b.order)
                            .map((lesson) => {
                                const content = (
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3 text-foreground">
                                            {lesson.freePreview ? (
                                                <Play className="h-4 w-4 text-primary" />
                                            ) : (
                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className={`text-sm font-medium ${lesson.freePreview ? "" : "text-muted-foreground"}`}>
                                                {lesson.title}
                                            </span>
                                            {lesson.duration ? (
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDuration(lesson.duration)}
                                                </span>
                                            ) : null}
                                        </div>
                                        {lesson.freePreview ? (
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                preview
                                            </span>
                                        ) : null}
                                    </div>
                                );

                                return lesson.freePreview ? (
                                    <a
                                        key={lesson.id}
                                        href={`/course/${courseSlug}/learn?lesson=${encodeURIComponent(
                                            lesson.lessonId,
                                        )}`}
                                        className="block  hover:bg-background3 transition-colors"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div
                                        key={lesson.id}
                                        className="bg-main transition-colors"
                                    >
                                        {content}
                                    </div>
                                );
                            })
                    ) : (
                        <div className="p-4 text-sm text-muted-foreground">
                            Este módulo aún no tiene lecciones disponibles.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
