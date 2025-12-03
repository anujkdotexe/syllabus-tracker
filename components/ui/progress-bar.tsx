"use client";

import * as React from "react";
// import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    value: number;
    max?: number;
    className?: string;
    indicatorClassName?: string;
}

export function ProgressBar({
    value,
    max = 100,
    className,
    indicatorClassName,
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div
            className={cn(
                "h-2 w-full overflow-hidden rounded-full bg-secondary",
                className
            )}
        >
            <div
                className={cn("h-full bg-primary transition-all duration-500 ease-out", indicatorClassName)}
                // initial={{ width: 0 }}
                // animate={{ width: `${percentage}%` }}
                // transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
