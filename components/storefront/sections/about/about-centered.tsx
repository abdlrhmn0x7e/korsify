import type { AboutContent, StatItem } from "@/convex/db/storefronts/validators";
import { LazyStorageImage } from "@/components/lazy-storage-image";

interface AboutCenteredProps {
  content: AboutContent;
}

const defaultStats: Array<StatItem> = [
  { id: "1", value: "50+", label: "Courses" },
  { id: "2", value: "10k+", label: "Students" },
  { id: "3", value: "4.9", label: "Rating" },
];

const defaultDescription = "Passionate about teaching and helping students succeed. With years of experience in the field, we bring you the highest quality education and practical knowledge.";

export function AboutCentered({ content }: AboutCenteredProps) {
  const { title, description, showStats, imageStorageId, stats } = content;
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-20 px-4 @3xl:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {imageStorageId && (
          <div className="mx-auto w-32 h-32 rounded-full overflow-hidden">
            <LazyStorageImage
              storageId={imageStorageId}
              alt={title}
              className="w-full h-full"
            />
          </div>
        )}
        <h2 className="text-3xl @3xl:text-4xl font-bold">{title}</h2>
        <div className="prose dark:prose-invert mx-auto">
          <p className="text-lg text-muted-foreground">
            {description || defaultDescription}
          </p>
        </div>

        {showStats && displayStats.length > 0 && (
          <div className="flex justify-center gap-12 pt-8">
            {displayStats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
