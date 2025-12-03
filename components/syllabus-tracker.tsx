"use client";

import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubjectCard, Subject } from "@/components/subject-card";
import { SyllabusItem } from "@/components/syllabus-item";
import { ProgressBar } from "@/components/ui/progress-bar";
import { createSubject, deleteSubject, toggleTopic, updateTopicLink } from "@/app/actions";
import { useRouter } from "next/navigation";

interface SyllabusTrackerProps {
    initialSubjects: Subject[];
}

export function SyllabusTracker({ initialSubjects }: SyllabusTrackerProps) {
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
    const [isAddingSubject, setIsAddingSubject] = useState(false);

    // New Subject Form State
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectSyllabus, setNewSubjectSyllabus] = useState("");

    useEffect(() => {
        setSubjects(initialSubjects);
    }, [initialSubjects]);

    const activeSubject = subjects.find((s) => s.id === activeSubjectId);

    const handleAddSubject = async () => {
        if (!newSubjectName.trim()) return;

        await createSubject(newSubjectName, newSubjectSyllabus);

        setNewSubjectName("");
        setNewSubjectSyllabus("");
        setIsAddingSubject(false);
        router.refresh();
    };

    const handleDeleteSubject = async (id: string) => {
        if (confirm("Are you sure you want to delete this subject?")) {
            setSubjects(subjects.filter((s) => s.id !== id));
            if (activeSubjectId === id) setActiveSubjectId(null);
            await deleteSubject(id);
            router.refresh();
        }
    };

    const handleToggleTopic = async (subjectId: string, topicId: string, currentCompleted: boolean) => {
        setSubjects(
            subjects.map((s) => {
                if (s.id !== subjectId) return s;
                return {
                    ...s,
                    topics: s.topics.map((t) =>
                        t.id === topicId ? { ...t, completed: !currentCompleted } : t
                    ),
                };
            })
        );
        await toggleTopic(topicId, currentCompleted);
        router.refresh();
    };

    const handleUpdateTopicLink = async (subjectId: string, topicId: string, link: string) => {
        setSubjects(
            subjects.map((s) => {
                if (s.id !== subjectId) return s;
                return {
                    ...s,
                    topics: s.topics.map((t) =>
                        t.id === topicId ? { ...t, resourceLink: link } : t
                    ),
                };
            })
        );
        await updateTopicLink(topicId, link);
        router.refresh();
    };

    return (
        <main className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans selection:bg-primary/20">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Syllabus Tracker</h1>
                            <p className="text-sm text-muted-foreground">Track your progress & resources</p>
                        </div>
                    </div>

                    {!activeSubject && (
                        <Button onClick={() => setIsAddingSubject(true)} className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> New Subject
                        </Button>
                    )}
                </header>

                {/* <AnimatePresence mode="wait"> */}
                {/* VIEW: Add Subject Form */}
                {isAddingSubject && (
                    <div
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="glass-card border-primary/20">
                            <CardHeader>
                                <CardTitle>Add New Subject</CardTitle>
                                <CardDescription>
                                    Paste your syllabus below to auto-generate topics.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject Name</label>
                                    <Input
                                        placeholder="e.g. Microprocessors"
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 text-primary" />
                                        Syllabus Content (Paste here)
                                    </label>
                                    <textarea
                                        className="flex min-h-[200px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                        placeholder="Introduction to 8085&#10;Addressing Modes&#10;Instruction Set&#10;..."
                                        value={newSubjectSyllabus}
                                        onChange={(e) => setNewSubjectSyllabus(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Each line will be created as a separate topic.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="ghost" onClick={() => setIsAddingSubject(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddSubject} disabled={!newSubjectName}>
                                        Create Subject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* VIEW: Subject Detail */}
                {!isAddingSubject && activeSubject && (
                    <div
                        key="detail"
                        className="space-y-6"
                    >
                        <Button
                            variant="ghost"
                            onClick={() => setActiveSubjectId(null)}
                            className="pl-0 hover:pl-2 transition-all"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Button>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-primary">{activeSubject.name}</h2>
                                <p className="text-muted-foreground">
                                    {activeSubject.topics.filter((t) => t.completed).length} of {activeSubject.topics.length} completed
                                </p>
                            </div>
                            <div className="w-full md:w-64">
                                <ProgressBar
                                    value={activeSubject.topics.length ? (activeSubject.topics.filter((t) => t.completed).length / activeSubject.topics.length) * 100 : 0}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {activeSubject.topics.map((topic) => (
                                <SyllabusItem
                                    key={topic.id}
                                    topic={topic}
                                    onToggle={(id) => handleToggleTopic(activeSubject.id, id, topic.completed)}
                                    onUpdateLink={(id, link) => handleUpdateTopicLink(activeSubject.id, id, link)}
                                />
                            ))}
                            {activeSubject.topics.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    No topics found. You can add more later.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* VIEW: Dashboard Grid */}
                {!isAddingSubject && !activeSubject && (
                    <div
                        key="grid"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {subjects.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onClick={() => setActiveSubjectId(subject.id)}
                                onDelete={() => handleDeleteSubject(subject.id)}
                            />
                        ))}

                        {subjects.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold">No subjects yet</h3>
                                <p className="text-muted-foreground mt-2 mb-6">
                                    Get started by adding your first subject and syllabus.
                                </p>
                                <Button onClick={() => setIsAddingSubject(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                {/* </AnimatePresence> */}
            </div>
        </main>
    );
}
