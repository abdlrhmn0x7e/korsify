import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export function AddCourseButton({
  variant = "ghost",
}: {
  variant?: "default" | "outline" | "ghost";
}) {
  return (
    <Button variant={variant}>
      Add New Course
      <IconPlus />
    </Button>
  );
}
