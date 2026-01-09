const stats = [
  { id: 1, name: "Transactions every 24 hours", value: "44M" },
  { id: 2, name: "Assets under holding", value: "$20 trillion" },
  { id: 3, name: "New users annually", value: "46K+" },
];

export default function StatSection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-2"
            >
              <dt className="text-muted-foreground">{stat.name}</dt>
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
