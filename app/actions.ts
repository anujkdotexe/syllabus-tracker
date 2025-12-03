'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSubjects() {
    try {
        return await prisma.subject.findMany({
            include: { topics: { orderBy: { orderIndex: 'asc' } } },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Database Error:", error);
        return [];
    }
}

export async function createSubject(name: string, syllabusText: string) {
    // improved parsing logic
    const lines = syllabusText
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => {
            // Filter out empty lines
            if (line.length === 0) return false;
            // Filter out single numbers (e.g. "1", "2") often found in table copies
            if (/^\d+$/.test(line)) return false;
            // Filter out page numbers or short noise (e.g. "54 | P")
            if (line.length < 4 && !/^[a-zA-Z]/.test(line)) return false;
            // Filter out common headers/footers from the example
            if (line.includes("Parul University") || line.includes("Academic Booklet") || line.includes("Subject S")) return false;
            if (line.toLowerCase() === "topics" || line.toLowerCase() === "sr.") return false;

            return true;
        });

    const topicsWithOrder = lines.map(title => ({
        title,
        sortKey: getSortKey(title)
    })).sort((a, b) => a.sortKey - b.sortKey);

    const topicsData = topicsWithOrder.map((t, index) => ({
        title: t.title,
        orderIndex: index
    }));

    await prisma.subject.create({
        data: {
            name,
            topics: {
                create: topicsData
            }
        }
    });
    revalidatePath('/');
}

function getSortKey(title: string): number {
    const match = title.match(/^(\d+)|^(Unit|Module|Chapter)\s*(\d+|[IVX]+)/i);
    if (!match) return 9999;

    if (match[1]) return parseInt(match[1]);

    if (match[3]) {
        const num = parseInt(match[3]);
        if (!isNaN(num)) return num;

        const romans: Record<string, number> = {
            'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
            'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
        };
        return romans[match[3].toUpperCase()] || 9999;
    }

    return 9999;
}

export async function deleteSubject(id: string) {
    await prisma.subject.delete({ where: { id } });
    revalidatePath('/');
}

export async function toggleTopic(id: string, currentState: boolean) {
    await prisma.topic.update({
        where: { id },
        data: { completed: !currentState }
    });
    revalidatePath('/');
}

export async function updateTopicLink(id: string, link: string) {
    await prisma.topic.update({
        where: { id },
        data: { resourceLink: link }
    });
    revalidatePath('/');
}
