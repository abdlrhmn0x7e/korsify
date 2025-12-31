"use client";

import { EditorMenuBar } from "./menu-bar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  if (!editor) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="border rounded-md h-full">
      <EditorMenuBar editor={editor} className="shrink-0" />

      <ScrollArea
        onClick={() => editor.chain().focus().run()}
        className="h-full p-4"
      >
        <EditorContent editor={editor} className="size-full" />
      </ScrollArea>
    </div>
  );
}
