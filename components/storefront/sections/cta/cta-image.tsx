import Image from "next/image";
import { IconChevronRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-muted relative grid grid-cols-1 flex-col justify-between gap-4 overflow-hidden rounded-lg text-center lg:grid-cols-2 lg:flex-row lg:gap-10 lg:text-start">
          <header className="flex flex-col px-4 py-10 lg:px-10">
            <div className="mb-4 space-y-4">
              <h3 className="font-heading text-3xl text-balance md:text-4xl">
                Ready to Transform Your Website?
              </h3>
              <p className="text-muted-foreground md:text-lg">
                Join thousands of satisfied customers who have optimized their
                websites and boosted conversions with Metro&#39;s AI-powered
                platform.
              </p>
            </div>
            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row! lg:justify-start">
              <Button>
                Start Free Trial
                <IconChevronRight />
              </Button>
              <Button variant="outline">Schedule a Demo</Button>
            </div>
          </header>
          <figure className="relative lg:mt-10 lg:self-end">
            <Image
              className="lg:rounded-te-none aspect-video w-full rounded-tl-lg rounded-tr-lg object-cover lg:rounded-tr-none"
              width={300}
              height={300}
              src="https://images.unsplash.com/photo-1760346738721-235e811f573d?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="shadcn landing page"
              unoptimized
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
