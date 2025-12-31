"use client";

import { EditorContent, type JSONContent } from "@tiptap/react";
import { useEditor } from "@/components/editor/use-editor";

export function TiptapViewer({ content }: { content: JSONContent }) {
  const { editor } = useEditor({ defaultContent: content });

  if (!editor) return null;

  editor.setEditable(false);

  return (
    <div className="prose prose-pink">
      <EditorContent editor={editor} />
    </div>
  );
}
