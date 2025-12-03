import { getSubjects } from "./actions";
import { SyllabusTracker } from "@/components/syllabus-tracker";

// Force dynamic rendering since we are fetching data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const subjects = await getSubjects();
  // We need to cast the subjects to match the expected type if there are minor mismatches
  // or ensure getSubjects returns exactly what SyllabusTracker expects.
  // Prisma returns dates as Date objects, but Client Components can handle them if passed from Server Components in Next.js 13+ (they get serialized).
  // However, it's safer to ensure they are compatible.

  return <SyllabusTracker initialSubjects={subjects} />;
}
