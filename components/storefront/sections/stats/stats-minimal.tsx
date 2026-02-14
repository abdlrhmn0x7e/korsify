import type { StatItem } from "@/convex/db/storefronts/validators";

interface StatsMinimalProps {
  stats: Array<StatItem>;
}

const defaultStats: Array<StatItem> = [
  { id: "1", value: "44M", label: "Transactions every 24 hours" },
  { id: "2", value: "$20 trillion", label: "Assets under holding" },
  { id: "3", value: "46K+", label: "New users annually" },
];

export function StatsMinimal({ stats }: StatsMinimalProps) {
  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-16 text-center lg:grid-cols-3">
          {displayStats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-2"
            >
              <dt className="text-muted-foreground">{stat.label}</dt>
              <dd className="font-heading order-first text-3xl sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default StatsMinimal;
