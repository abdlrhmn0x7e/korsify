import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  IconCalendar,
  IconCurrencyDollar,
  IconPencil,
  IconPencilCancel,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiptapViewer } from "@/components/editor/viewer";
import { JSONContent } from "@tiptap/react";
import { formatPrice } from "@/lib/format-price";
import { CourseSections } from "./course-sections";
import { WholePageSpinner } from "@/components/whole-page-spinner";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function CourseDetails({ slug }: { slug: string }) {
  const course = useQuery(api.teachers.courses.queries.getBySlug, {
    slug,
  });

  const isPending = course === undefined;
  const courseNotFound = course === null;

  if (isPending) {
    return <WholePageSpinner />;
  }

  if (courseNotFound) {
    return <CourseNotFound />;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <AspectRatio
          ratio={16 / 9}
          className="relative h-32 shrink-0 overflow-hidden rounded-md border"
        >
          <Image
            src={course.thumbnailUrl ?? ""}
            className="size-full object-cover"
            alt={course.title}
            fill
          />
        </AspectRatio>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="line-clamp-2">{course.title}</h4>
            <Badge
              className="shrink-0 capitalize"
              variant={course.status === "draft" ? "secondary" : "default"}
            >
              {course.status === "draft" ? <IconPencil /> : <IconUpload />}
              {course.status}
            </Badge>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center text-muted-foreground">
              <IconCalendar className="mr-1 size-3.5" />
              Created
            </span>
            <span>{formatDate(new Date(course._creationTime))}</span>

            <span className="flex items-center text-muted-foreground">
              <IconCurrencyDollar className="mr-1 size-3.5" />
              Price
            </span>
            <span className="font-medium">
              {course.pricing.overridePrice ? (
                <>
                  <span className="mr-1 line-through opacity-50">
                    {formatPrice(course.pricing.price)}
                  </span>
                  {formatPrice(course.pricing.overridePrice)}
                </>
              ) : (
                formatPrice(course.pricing.price)
              )}
            </span>

            <span className="flex items-center text-muted-foreground">
              <IconSearch className="mr-1 size-3.5" />
              SEO
            </span>
            <span className="truncate" title={course.seo?.metaTitle}>
              {course.seo?.metaTitle ?? "Not configured"}
            </span>
          </div>
        </div>
      </div>

      <Card className="gap-0 p-4">
        <CardHeader className="p-0">
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-full max-h-60 overflow-y-auto">
          {course.description && course.description.content.length > 0 ? (
            <TiptapViewer content={course.description as JSONContent} />
          ) : (
            <Empty className="mb-12">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-12">
                  <IconPencilCancel className="size-6" />
                </EmptyMedia>
                <EmptyTitle>No Description</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>

      <CourseSections courseId={course._id} />
    </div>
  );
}

function CourseNotFound() {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconX />
        </EmptyMedia>
        <EmptyTitle>{"This Course Doesn't Exist"}</EmptyTitle>
        <EmptyDescription>Are your sure the URL is correct?</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
