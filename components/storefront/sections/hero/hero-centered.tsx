import { IconStar } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <header className="mx-auto flex max-w-3xl flex-col gap-4">
          <h1 className="font-heading text-4xl text-balance lg:text-5xl lg:leading-14">
            Simplify Your Workflow with Our SaaS Platform
          </h1>
          <p className="text-muted-foreground text-balance lg:text-lg">
            Manage users, track analytics, automate tasks, and grow your
            business with a single platform designed for modern SaaS teams.
          </p>
        </header>

        <div className="mt-8 flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-center">
          <Button render={<Link href="#" />} className="w-full sm:w-auto">
            some text
          </Button>
          <Button
            render={<Link href="#" />}
            variant="outline"
            className="w-full sm:w-auto"
          >
            some other text
          </Button>
        </div>

        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <div className="inline-flex items-center -space-x-4">
            <Avatar className="size-10">
              <AvatarImage
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHwy"
                alt="User 1"
              />
            </Avatar>
            <Avatar className="size-10">
              <AvatarImage
                src="https://images.unsplash.com/photo-1728577740843-5f29c7586afe?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHwy"
                alt="User 2"
              />
            </Avatar>
            <Avatar className="size-10">
              <AvatarImage
                src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHwy"
                alt="User 3"
              />
            </Avatar>
            <Avatar className="size-10">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHwy"
                alt="User 4"
              />
            </Avatar>
            <Avatar className="size-10">
              <AvatarImage
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGF2YXRhcnxlbnwwfHwwfHx8Mg%3D%3D"
                alt="User 5"
              />
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, index) => (
                <IconStar
                  key={index}
                  className="size-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-sm font-semibold">4.9</span>
            </div>
            <p className="text-muted-foreground text-start text-xs font-medium">
              from 500+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
