import { Spinner } from "./ui/spinner";

export function WholePageSpinner() {
  return (
    <div className="h-full flex gap-1 items-center justify-center text-muted-foreground">
      <Spinner className="size-6" />
      <span className="text-md">Loading Data</span>
    </div>
  );
}
