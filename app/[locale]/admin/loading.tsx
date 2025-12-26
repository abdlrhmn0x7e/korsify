import { Spinner } from "@/components/ui/spinner";

export default function AdminLoading() {
  return (
    <div className="flex size-full items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
}
