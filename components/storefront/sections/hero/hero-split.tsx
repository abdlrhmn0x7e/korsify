import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <header className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              🚀 Launch Faster
              <IconArrowUpRight />
            </Badge>
            <h1 className="font-heading my-4 text-4xl text-balance md:text-5xl lg:leading-14">
              All-in-One Platform for Managing Your SaaS
            </h1>
            <p className="text-muted-foreground mb-8 text-balance lg:text-lg">
              Streamline operations, track metrics, and scale your SaaS business
              with ease. Everything you need, in one powerful dashboard.
            </p>
            <div className="flex justify-center gap-2">
              <Button render={<Link href={"#"} />}>Some text</Button>
              <Button render={<Link href={"#"} />} variant="outline">
                Some other text
              </Button>
            </div>
          </header>

          <img
            src="https://images.unsplash.com/photo-1748723594319-142e211b46a9?q=80&w=700&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dashboard interface of the SaaS platform"
            className="aspect-square w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
}
