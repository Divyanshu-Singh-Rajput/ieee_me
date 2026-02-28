import { LessonView } from "@/components/LessonView";
import { LEVEL_DATA } from "@/lib/lesson/master";
import { auth } from "@/server/auth";
import { notFound } from "next/navigation";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const levelId = parseInt(id)-1;

  const level = LEVEL_DATA[levelId];
const user_id = await auth().then(session => session?.user.id);
  if (!level) {
    return notFound(); // Standard Next.js 404
  }

  return (
    <main className="bg-black h-full">
     {user_id&& <LessonView level={level} levelId={levelId} user_id={user_id} />}
    </main>
  );
}