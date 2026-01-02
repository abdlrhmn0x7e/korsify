"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  IconArrowLeft,
  IconFileDescription,
  IconX,
  IconDownload,
  IconEye,
  IconAlertCircle,
  IconEdit,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiptapViewer } from "@/components/editor/viewer";
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
import { useScopedI18n } from "@/locales/client";
import { DirectedArrow } from "@/components/directed-arrow";
import { Spinner } from "@/components/ui/spinner";
import { EditLessonDialog } from "./edit-lesson-dialog";

interface LessonDetailsProps {
  lessonId: Id<"lessons">;
  onBack: () => void;
}

export function LessonDetails({ lessonId, onBack }: LessonDetailsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const lesson = useQuery(api.teachers.lessons.queries.getById, { lessonId });
  const t = useScopedI18n("dashboard.courses.lessonDetails");
  const isPending = lesson === undefined;

  if (isPending) {
    return <LessonDetailsSkeleton onBack={onBack} />;
  }

  if (lesson === null) {
    return <LessonNotFound onBack={onBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <DirectedArrow inverse className="size-4" />
          {t("back")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
          <IconEdit className="size-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="space-y-4 px-2">
        <VideoPreview videoId={lesson.videoId} title={lesson.title} />
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl capitalize font-semibold">{lesson.title}</h3>
          {lesson.isFree && (
            <Badge variant="secondary" className="shrink-0">
              <IconEye className="size-3 mr-1" />
              {t("freePreview")}
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("description")}
          </h4>
          {lesson.description ? (
            <div className="max-h-60 overflow-y-auto">
              <TiptapViewer content={lesson.description as JSONContent} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {t("noDescription")}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("attachments.title")}
          </h4>
          {lesson.pdfUrls && lesson.pdfUrls.length > 0 ? (
            <ul className="space-y-1">
              {lesson.pdfUrls.map((url, index) => (
                <li key={index}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-accent transition-colors text-sm"
                  >
                    <IconFileDescription className="size-4 text-muted-foreground shrink-0" />
                    <span className="flex-1">
                      {t("attachments.attachment")} {index + 1}
                    </span>
                    <IconDownload className="size-3.5 text-muted-foreground shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {t("attachments.noAttachments")}
            </p>
          )}
        </div>
      </div>

      <EditLessonDialog
        lesson={lesson}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
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
  const t = useScopedI18n("dashboard.courses.lessonDetails.video");
  const muxAsset = useQuery(api.teachers.mux.queries.getVideo, {
    muxAssetId: videoId,
  });

  if (muxAsset === undefined) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
        <Spinner />
        <p className="text-sm text-muted-foreground">{t("processing")}</p>
      </div>
    );
  }

  if (muxAsset.status === "errored") {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
        <IconAlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-destructive">
          {muxAsset.errorMessage ?? t("failed")}
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
        <Spinner />
        <p className="text-sm text-muted-foreground">
          {muxAsset.status === "processing" ? t("processing") : t("waiting")}
        </p>
      </div>
    );
  }

  if (!muxAsset.playbackId) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
        <IconAlertCircle className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("notAvailable")}</p>
      </div>
    );
  }

  return <VideoPlayer playbackId={muxAsset.playbackId} title={title} />;
}

function LessonDetailsSkeleton({ onBack }: { onBack: () => void }) {
  const t = useScopedI18n("dashboard.courses.lessonDetails");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <IconArrowLeft className="size-4" />
          {t("back")}
        </Button>
      </div>

      <div className="space-y-4 px-2">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

function LessonNotFound({ onBack }: { onBack: () => void }) {
  const t = useScopedI18n("dashboard.courses.lessonDetails");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <IconArrowLeft className="size-4" />
          {t("back")}
        </Button>
      </div>
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconX />
          </EmptyMedia>
          <EmptyTitle>{t("notFound.title")}</EmptyTitle>
          <EmptyDescription>{t("notFound.description")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
