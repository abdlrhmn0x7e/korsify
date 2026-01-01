"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  IconArrowLeft,
  IconFileDescription,
  IconX,
  IconDownload,
  IconEye,
  IconLoader2,
  IconAlertCircle,
  IconPencilCancel,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiptapViewer } from "@/components/editor/viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { JSONContent } from "@tiptap/react";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/video/video-player";

interface LessonDetailsProps {
  lessonId: Id<"lessons">;
  onBack: () => void;
}

export function LessonDetails({ lessonId, onBack }: LessonDetailsProps) {
  const lesson = useQuery(api.teachers.lessons.queries.getById, { lessonId });
  const isPending = lesson === undefined;

  if (isPending) {
    return <LessonDetailsSkeleton onBack={onBack} />;
  }

  if (lesson === null) {
    return <LessonNotFound onBack={onBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <IconArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg capitalize font-semibold">{lesson.title}</h3>
          {lesson.isFree && (
            <Badge variant="secondary" className="shrink-0">
              <IconEye className="size-3 mr-1" />
              Free Preview
            </Badge>
          )}
        </div>
        <VideoPreview videoId={lesson.videoId} title={lesson.title} />

        <Card className="gap-0 p-4">
          <CardHeader className="p-0">
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full max-h-60 overflow-y-auto">
            {lesson.description ? (
              <TiptapViewer content={lesson.description as JSONContent} />
            ) : (
              <Empty>
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

        <Card className="gap-0 p-4">
          <CardHeader className="p-0">
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            {lesson.pdfUrls && lesson.pdfUrls.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {lesson.pdfUrls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-sm"
                    >
                      <IconFileDescription className="size-5 text-muted-foreground shrink-0" />
                      <span className="flex-1">Attachment {index + 1}</span>
                      <IconDownload className="size-4 text-muted-foreground shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="size-12">
                    <IconFileDescription className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle>No Attachments</EmptyTitle>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VideoPreview({
  videoId,
  title,
}: {
  videoId: Id<"muxAssets">;
  title: string;
}) {
  const muxAsset = useQuery(api.teachers.mux.queries.getVideo, {
    muxAssetId: videoId,
  });

  if (muxAsset === undefined) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
        <IconLoader2 className="size-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (muxAsset.status === "errored") {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
        <IconAlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-destructive">
          {muxAsset.errorMessage ?? "Video processing failed"}
        </p>
      </div>
    );
  }

  if (
    muxAsset.status === "processing" ||
    muxAsset.status === "waiting_upload"
  ) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
        <IconLoader2 className="size-8 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">
          {muxAsset.status === "processing"
            ? "Video is processing..."
            : "Waiting for upload..."}
        </p>
      </div>
    );
  }

  if (!muxAsset.playbackId) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
        <IconAlertCircle className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Video not available</p>
      </div>
    );
  }

  return <VideoPlayer playbackId={muxAsset.playbackId} title={title} />;
}

function LessonDetailsSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <IconArrowLeft className="size-4" />
          Back
        </Button>
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="aspect-video w-full rounded-lg" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function LessonNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <IconArrowLeft className="size-4" />
          Back
        </Button>
      </div>
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconX />
          </EmptyMedia>
          <EmptyTitle>Lesson Not Found</EmptyTitle>
          <EmptyDescription>
            This lesson may have been deleted or doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
