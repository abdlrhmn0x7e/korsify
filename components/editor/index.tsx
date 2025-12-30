"use client";

import { AnimatePresence, motion } from "motion/react";
import { EditorMenuBar } from "./menu-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEditor } from "./use-editor";
import { EditorContent, type JSONContent } from "@tiptap/react";
import { Skeleton } from "@/components/ui/skeleton";

export function Editor({
  onUpdate,
  defaultContent,
}: {
  onUpdate: (json: JSONContent) => void;
  defaultContent?: JSONContent;
}) {
  const { editor } = useEditor({ onUpdate, defaultContent });
  const [isExpanded, setIsExpanded] = useState(false);

  if (!editor) return <Skeleton className="h-[24rem] w-full" />;

  function handleExpand() {
    setIsExpanded((prev) => !prev);
  }

  return (
    <AnimatePresence>
      <motion.div
        className="border-input bg-background ring-ring/24 has-focus-visible:border-ring has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 relative w-full rounded-lg border bg-clip-padding text-base/5 transition-[color,background-color,box-shadow,border-color] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:before:shadow-sm has-focus-visible:ring-[3px] has-disabled:opacity-64 has-aria-invalid:before:shadow-none sm:text-sm dark:bg-clip-border dark:shadow-black/24 dark:not-has-disabled:shadow-sm dark:not-has-disabled:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)]"
        layoutId="editor-container"
        key="editor-container-collapsed"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        {!isExpanded && (
          <>
            <EditorMenuBar
              editor={editor}
              onExpand={handleExpand}
              expanded={isExpanded}
              className="shrink-0"
            />

            <ScrollArea
              onClick={() => editor.chain().focus().run()}
              className="h-[20rem] p-4"
            >
              <EditorContent editor={editor} className="size-full" />
            </ScrollArea>
          </>
        )}
      </motion.div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            "flex h-[95svh] w-full max-w-[calc(100%-2rem)] flex-col gap-1 p-1 sm:max-w-[80svw]"
          )}
        >
          <DialogHeader className="hidden">
            <DialogTitle>Editor</DialogTitle>
            <DialogDescription>Fullscreen editor</DialogDescription>
          </DialogHeader>

          {isExpanded && (
            <>
              <EditorMenuBar
                editor={editor}
                onExpand={handleExpand}
                className="shrink-0"
                expanded={isExpanded}
                disableTooltips
              />

              <ScrollArea
                onClick={() => editor.chain().focus().run()}
                className="flex-1 p-4"
              >
                <div className="h-[80svh]">
                  <EditorContent editor={editor} className="w-full pb-24" />
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}
