import type { AboutContent, StatItem } from "@/convex/db/storefronts/validators";

interface AboutStatsFocusProps {
  content: AboutContent;
}

const defaultStats: Array<StatItem> = [
  { id: "1", value: "50+", label: "Courses" },
  { id: "2", value: "10k+", label: "Students" },
  { id: "3", value: "4.9", label: "Rating" },
  { id: "4", value: "100%", label: "Satisfaction" },
];

export function AboutStatsFocus({ content }: AboutStatsFocusProps) {
  const { title, stats } = content;
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-20 px-4 @3xl:px-8 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="text-3xl @3xl:text-4xl font-bold text-center">{title}</h2>
        
        <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-8">
          {displayStats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl @3xl:text-5xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
