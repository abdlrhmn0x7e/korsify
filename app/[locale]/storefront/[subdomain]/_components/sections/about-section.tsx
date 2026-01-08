import type { AboutContent, AboutVariant } from "@/convex/db/storefronts/validators";

interface AboutSectionProps {
  content: AboutContent & { imageUrl?: string };
  variant: AboutVariant;
}

export function AboutSection({ content, variant }: AboutSectionProps) {
  const { title, showStats, imageUrl } = content;

  if (variant === "centered") {
    return (
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {imageUrl && (
            <div className="mx-auto w-32 h-32 rounded-full overflow-hidden">
              <img 
                src={imageUrl} 
                alt={title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <div className="prose dark:prose-invert mx-auto">
            <p className="text-lg text-muted-foreground">
              Passionate about teaching and helping students succeed. With years of experience
              in the field, we bring you the highest quality education and practical knowledge.
            </p>
          </div>

          {showStats && (
            <div className="flex justify-center gap-12 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === "stats-focus") {
    return (
      <section className="py-20 px-4 md:px-8 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center">{title}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">50+</div>
              <div className="text-sm opacity-80">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">10k+</div>
              <div className="text-sm opacity-80">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">4.9</div>
              <div className="text-sm opacity-80">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">100%</div>
              <div className="text-sm opacity-80">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default: side-by-side
  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <div className="prose dark:prose-invert">
            <p className="text-lg text-muted-foreground">
              Passionate about teaching and helping students succeed. With years of experience
              in the field, we bring you the highest quality education and practical knowledge.
            </p>
            <p className="text-lg text-muted-foreground">
              Our mission is to make learning accessible, engaging, and effective for everyone.
              Join thousands of students who have already transformed their careers.
            </p>
          </div>

          {showStats && (
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          {imageUrl ? (
             <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
               <img 
                 src={imageUrl} 
                 alt={title}
                 className="object-cover w-full h-full"
               />
             </div>
          ) : (
            <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image selected</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
