import type { AboutContent, StatItem } from "@/convex/db/storefronts/validators";
import { LazyStorageImage } from "@/components/lazy-storage-image";

interface AboutSideBySideProps {
  content: AboutContent;
}

const defaultStats: Array<StatItem> = [
  { id: "1", value: "50+", label: "Courses" },
  { id: "2", value: "10k+", label: "Students" },
  { id: "3", value: "4.9", label: "Rating" },
];

const defaultDescription = "Passionate about teaching and helping students succeed. With years of experience in the field, we bring you the highest quality education and practical knowledge.";

const defaultDescriptionExtended = "Our mission is to make learning accessible, engaging, and effective for everyone. Join thousands of students who have already transformed their careers.";

export function AboutSideBySide({ content }: AboutSideBySideProps) {
  const { title, description, showStats, imageStorageId, stats } = content;
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-20 px-4 @3xl:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 @3xl:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl @3xl:text-4xl font-bold">{title}</h2>
          <div className="prose dark:prose-invert">
            <p className="text-lg text-muted-foreground">
              {description || defaultDescription}
            </p>
            {!description && (
              <p className="text-lg text-muted-foreground">
                {defaultDescriptionExtended}
              </p>
            )}
          </div>

          {showStats && displayStats.length > 0 && (
            <div className="grid grid-cols-3 gap-8 pt-8">
              {displayStats.map((stat) => (
                <div key={stat.id}>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <LazyStorageImage
            storageId={imageStorageId}
            alt={title}
            className="aspect-square rounded-2xl shadow-xl"
            fallback={
              <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image selected</span>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
