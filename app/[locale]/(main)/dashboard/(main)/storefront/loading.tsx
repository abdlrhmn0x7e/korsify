import { Skeleton } from "@/components/ui/skeleton";

export default function StorefrontBuilderLoading() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      <div className="w-80 border-r bg-background p-4">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-6 space-y-2">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="flex-1 bg-muted/30 p-6">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="h-150 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
