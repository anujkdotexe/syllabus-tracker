"use client";

"use client";

// import { motion } from "framer-motion";
import { ArrowRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ProgressBar } from "./ui/progress-bar";
import { Button } from "./ui/button";
import { SyllabusTopic } from "./syllabus-item";

export interface Subject {
    id: string;
    name: string;
    topics: SyllabusTopic[];
}

interface SubjectCardProps {
    subject: Subject;
    onClick: () => void;
    onDelete: () => void;
}

export function SubjectCard({ subject, onClick, onDelete }: SubjectCardProps) {
    const completedCount = subject.topics.filter((t) => t.completed).length;
    const totalCount = subject.topics.length;
    const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

    return (
        <div
            // whileHover={{ y: -5 }}
            // transition={{ type: "spring", stiffness: 300 }}
            className="transition-transform hover:-translate-y-1 duration-300"
        >
            <Card className="glass-card overflow-hidden border-white/5 bg-card/30 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold tracking-tight text-primary">
                            {subject.name}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <ProgressBar value={progress} className="h-2" />
                    <p className="mt-4 text-xs text-muted-foreground">
                        {completedCount} of {totalCount} topics completed
                    </p>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button
                        onClick={onClick}
                        className="w-full group"
                        variant="secondary"
                    >
                        View Syllabus
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
