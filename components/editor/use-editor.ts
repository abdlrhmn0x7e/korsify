"use client";

import { Bold } from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { UndoRedo } from "@tiptap/extensions";
import { FileHandler } from "@tiptap/extension-file-handler";
import { type JSONContent, useEditor as useTiptapEditor } from "@tiptap/react";
import { useMemo } from "react";
import { toastManager } from "@/components/ui/toast";
import { useUploadFiles } from "@/hooks/use-upload-files";

export function useEditor({
  onUpdate,
  defaultContent,
}: {
  onUpdate?: (json: JSONContent) => void;
  defaultContent?: JSONContent;
} = {}) {
  const { upload } = useUploadFiles();

  const extensions = useMemo(() => {
    return [
      UndoRedo,

      Document,
      Text,
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,

      Bold,
      Italic,
      Strike,
      Underline,
      Highlight,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["https", "http"],
        HTMLAttributes: {
          class: "text-primary cursor-pointer",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "size-full object-contain rounded-md overflow-hidden",
          width: "200px",
        },
      }),
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          const fileNames = files.map((file) => file.name).join(", ");

          toastManager.promise(upload(files), {
            loading: {
              title: "Uploading…",
              description: `Uploading ${fileNames}`,
            },
            success: (data) => {
              data.urls.forEach((url) => {
                currentEditor
                  .chain()
                  .insertContentAt(pos, {
                    type: "image",
                    attrs: { src: url },
                  })
                  .focus()
                  .run();
              });
              return {
                title: "Upload complete",
                description: `Uploaded ${data.successCount} file(s)`,
              };
            },
            error: () => ({
              title: "Upload failed",
              description: "Please try again.",
            }),
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          if (htmlContent) {
            return false;
          }

          const fileNames = files.map((file) => file.name).join(", ");

          toastManager.promise(upload(files), {
            loading: {
              title: "Uploading…",
              description: `Uploading ${fileNames}`,
            },
            success: (data) => {
              data.urls.forEach((url) => {
                currentEditor
                  .chain()
                  .insertContentAt(currentEditor.state.selection.anchor, {
                    type: "image",
                    attrs: { src: url },
                  })
                  .focus()
                  .run();
              });
              return {
                title: "Upload complete",
                description: `Uploaded ${data.successCount} file(s)`,
              };
            },
            error: () => ({
              title: "Upload failed",
              description: "Please try again.",
            }),
          });
        },
      }),
    ];
  }, [upload]);

  const editor = useTiptapEditor({
    content: defaultContent,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON());
    },
    extensions,

    editorProps: {
      attributes: {
        class:
          "m-auto prose prose-leading-2 prose-pink focus-visible:outline-none",
      },
    },

    immediatelyRender: false,
  });

  return { editor, extensions };
}
