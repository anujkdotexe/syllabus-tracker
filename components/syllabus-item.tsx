"use client";

import { useState } from "react";
import { Check, ExternalLink, Link as LinkIcon } from "lucide-react";
// import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export interface SyllabusTopic {
    id: string;
    title: string;
    completed: boolean;
    resourceLink?: string;
}

interface SyllabusItemProps {
    topic: SyllabusTopic;
    onToggle: (id: string) => void;
    onUpdateLink: (id: string, link: string) => void;
}

export function SyllabusItem({ topic, onToggle, onUpdateLink }: SyllabusItemProps) {
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [linkInput, setLinkInput] = useState(topic.resourceLink || "");

    const handleSaveLink = () => {
        onUpdateLink(topic.id, linkInput);
        setIsEditingLink(false);
    };

    return (
        <div
            // layout
            // initial={{ opacity: 0, y: 10 }}
            // animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group flex items-center justify-between rounded-lg border border-white/5 bg-card/30 p-4 backdrop-blur-sm transition-all hover:bg-card/50",
                topic.completed && "bg-primary/5 border-primary/20"
            )}
        >
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => onToggle(topic.id)}
                    className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all",
                        topic.completed
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30 hover:border-primary/50"
                    )}
                >
                    {topic.completed && <Check className="h-4 w-4" />}
                </button>
                <span
                    className={cn(
                        "text-sm font-medium transition-colors",
                        topic.completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                >
                    {topic.title}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {isEditingLink ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            placeholder="Paste link..."
                            className="h-8 w-48 rounded-md border border-input bg-background px-2 text-xs"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveLink();
                                if (e.key === "Escape") setIsEditingLink(false);
                            }}
                        />
                        <Button size="sm" variant="ghost" onClick={handleSaveLink} className="h-8 w-8 p-0">
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <>
                        {topic.resourceLink && (
                            <a
                                href={topic.resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                title="Open Resource"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsEditingLink(true)}
                            className={cn(
                                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                                !topic.resourceLink && "opacity-100" // Show if no link exists yet
                            )}
                            title="Edit Link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
