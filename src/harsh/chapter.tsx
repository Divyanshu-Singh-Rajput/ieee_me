import { CourseModule } from "@/components/course_module"

const modules = [
  {
    title: "Module 1: Introduction to Cybersecurity",
    lessons: [
      "1.1. The World of Cybersecurity",
      "1.2. Organizational Data",
      "1.3. What Was Taken?",
      "1.4. Cyber Attackers",
      "1.5. Cyberwarfare",
      "1.6. Quiz",
    ],
  },
  {
    title: "Module 2: Attacks, Concepts and Techniques",
    lessons: [
      "2.1. Analyzing a Cyber Attack",
      "2.2. Methods of Infiltration",
      "2.3. Security Vulnerability and Exploits",
      "2.4. The Cybersecurity Landscape",
      "2.5. Quiz",
    ],
  },
  {
    title: "Module 3: Protecting your Data and Privacy",
    lessons: [
      "3.1. Protecting Your Devices and Network",
      "3.2. Data Maintenance",
      "3.3. Who Owns Your Data?",
      "3.4. Safeguarding Your Online Privacy",
      "3.5. Discover Your Own Risky Online Behavior",
      "3.6. Quiz",
    ],
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-6 lg:py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="mb-2 text-center">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl text-balance">
            Cybersecurity Essentials
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Expand each module to explore its lessons
          </p>
        </header>

        {modules.map((mod, index) => (
          <CourseModule
            key={mod.title}
            title={mod.title}
            lessons={mod.lessons}
            defaultExpanded={index === 0}
          />
        ))}
      </div>
    </main>
  )
}
