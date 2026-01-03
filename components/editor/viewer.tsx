"use client";

import { EditorContent, type JSONContent } from "@tiptap/react";
import { useEditor } from "@/components/editor/use-editor";
import { useEffect } from "react";

export function TiptapViewer({ content }: { content: JSONContent }) {
  const { editor } = useEditor({ defaultContent: content });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) return null;

  editor.setEditable(false);

  return (
    <div className="prose prose-pink">
      <EditorContent editor={editor} />
    </div>
  );
}
