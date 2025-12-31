import { Spinner } from "@/components/ui/spinner";
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
  IconCurrencyDollar,
  IconPencil,
  IconSearch,
  IconTag,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TiptapViewer } from "@/components/editor/viewer";
import { JSONContent } from "@tiptap/react";
import { formatPrice } from "@/lib/format-price";
import { Separator } from "@/components/ui/separator";

export function CourseDetails({ slug }: { slug: string }) {
  const course = useQuery(api.teachers.courses.queries.getBySlug, {
    slug,
  });

  const isPending = course === undefined;
  const courseNotFound = course === null;

  if (isPending) {
    return (
      <div className="min-h-36 grid place-items-center">
        <Spinner />
      </div>
    );
  }

  if (courseNotFound) {
    return <CourseNotFound />;
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>
              created at {format(course._creationTime, "dd MMM yyyy")}
            </CardDescription>
          </div>
          <Badge
            className="capitalize"
            variant={course.status === "draft" ? "secondary" : "default"}
          >
            {course.status === "draft" ? <IconPencil /> : <IconUpload />}
            {course.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden border rounded-sm max-h-36">
            <img
              src={course.thumbnailUrl ?? ""}
              className="size-full object-cover"
              alt={course.title}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {course.description ? (
            <TiptapViewer content={course.description as JSONContent} />
          ) : (
            <p className="text-center text-muted-foreground text-sm">
              No description provided.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                <IconCurrencyDollar className="size-4" />
              </div>
              <CardTitle className="text-base">Pricing</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center">
            {course.pricing.overridePrice ? (
              <div className="text-center">
                <span className="text-muted-foreground line-through">
                  {formatPrice(course.pricing.price)}
                </span>
                <p className="text-xl font-bold">
                  {formatPrice(course.pricing.overridePrice)}
                </p>
                <Badge variant="secondary" className="mt-2">
                  <IconTag className="size-3" />
                  {Math.round(
                    ((course.pricing.price - course.pricing.overridePrice) /
                      course.pricing.price) *
                      100,
                  )}
                  % off
                </Badge>
              </div>
            ) : (
              <p className="text-3xl font-bold">
                {formatPrice(course.pricing.price)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
                <IconSearch className="size-4" />
              </div>
              <CardTitle className="text-base">SEO</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {course.seo ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Meta Title
                  </span>
                  <p className="text-sm font-medium">{course.seo.metaTitle}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Meta Description
                  </span>
                  <p className="text-sm">{course.seo.metaDescription}</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                No SEO data configured.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CourseNotFound() {
  return (
    <Empty>
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
