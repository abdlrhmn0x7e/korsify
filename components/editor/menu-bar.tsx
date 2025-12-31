"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBold,
  IconH1,
  IconH2,
  IconH3,
  IconHeading,
  IconHighlight,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconPhotoPlus,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "@/components/ui/drawer-dialog";
import { toast } from "sonner";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useUploadFiles } from "@/hooks/use-upload-files";

export function EditorMenuBar({
  editor,
  className,
}: {
  editor: Editor;
  className?: string;
}) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      canUndo: ctx.editor.can().chain().undo().run() ?? false,
      canRedo: ctx.editor.can().chain().redo().run() ?? false,

      isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
      isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
      isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,

      isBulletList: ctx.editor.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor.isActive("orderedList") ?? false,

      isBold: ctx.editor.isActive("bold") ?? false,
      isItalic: ctx.editor.isActive("italic") ?? false,
      isStrikethrough: ctx.editor.isActive("strike") ?? false,
      isUnderline: ctx.editor.isActive("underline") ?? false,
      isHighlight: ctx.editor.isActive("highlight") ?? false,
      isLink: ctx.editor.isActive("link") ?? false,

      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
      isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }) ?? false,
    }),
  });

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-1 border-b p-0.5",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        disabled={!editorState.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <IconArrowBackUp />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        disabled={!editorState.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <IconArrowForwardUp />
      </Button>

      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" type="button">
              <IconHeading />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            variant={editorState.isHeading1 ? "destructive" : "default"}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <IconH1 />
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            variant={editorState.isHeading2 ? "destructive" : "default"}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <IconH2 />
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            variant={editorState.isHeading3 ? "destructive" : "default"}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <IconH3 />
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" type="button">
              <IconList />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editorState.isBulletList ? "destructive" : "default"}
          >
            <IconList />
            Unordered List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editorState.isOrderedList ? "destructive" : "default"}
          >
            <IconListNumbers />
            Ordered List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />

      <Button
        variant={editorState.isBold ? "default" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <IconBold />
      </Button>
      <Button
        variant={editorState.isItalic ? "default" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <IconItalic />
      </Button>

      <Button
        variant={editorState.isUnderline ? "default" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <IconUnderline />
      </Button>
      <Button
        variant={editorState.isStrikethrough ? "default" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <IconStrikethrough />
      </Button>
      <Button
        variant={editorState.isHighlight ? "default" : "ghost"}
        size="icon"
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <IconHighlight />
      </Button>

      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" type="button">
              <IconAlignJustified />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            variant={editorState.isAlignLeft ? "destructive" : "default"}
          >
            <IconAlignLeft />
            Left
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            variant={editorState.isAlignCenter ? "destructive" : "default"}
          >
            <IconAlignCenter />
            Center
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            variant={editorState.isAlignRight ? "destructive" : "default"}
          >
            <IconAlignRight />
            Right
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            variant={editorState.isAlignJustify ? "destructive" : "default"}
          >
            <IconAlignJustified />
            Justify
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LinkDrawerDialog
        isLink={editorState.isLink}
        onLink={(url) => editor.chain().focus().setLink({ href: url }).run()}
      />

      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />

      <ImageButton editor={editor} />
    </div>
  );
}

function ImageButton({
  editor,
}: {
  editor: Editor;
}) {
  const [open, setOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { upload, isPending, fileStates, reset } = useUploadFiles({
    onFileSuccess: (file, storageId, url) => {
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      setOpen(false);
      reset();
    },
    onFileError: (file, error) => {
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    },
  });

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (imageFiles.length === 0) {
      toast.error("Please select an image file");
      return;
    }

    upload(imageFiles);
  }

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  const triggerButton = (
    <Button variant="ghost" size="icon" type="button">
      <IconPhotoPlus />
    </Button>
  );

  const uploadingFile = fileStates.find((s) => s.status === "uploading");

  return (
    <DrawerDialog open={open} onOpenChange={setOpen}>
      <DrawerDialogTrigger render={triggerButton} />
      <DrawerDialogContent>
        <DrawerDialogHeader>
          <DrawerDialogTitle>Add Image</DrawerDialogTitle>
          <DrawerDialogDescription>
            Upload an image to insert into the editor
          </DrawerDialogDescription>
        </DrawerDialogHeader>
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleButtonClick}
            disabled={isPending}
          >
            {isPending ? (
              <>Uploading {uploadingFile?.file.name ?? "..."}</>
            ) : (
              <>
                <IconPhotoPlus className="mr-2" />
                Choose Image
              </>
            )}
          </Button>
        </div>
        <DrawerDialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </DrawerDialogFooter>
      </DrawerDialogContent>
    </DrawerDialog>
  );
}

function LinkDrawerDialog({
  isLink,
  onLink,
}: {
  isLink: boolean;
  onLink: (url: string) => void;
}) {
  const [url, setUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);

  function handleLink() {
    const urlSchema = z.string().url();
    const result = urlSchema.safeParse(url);
    if (!result.success) {
      toast.error("Invalid URL. Please enter a valid URL.");
      return;
    }

    onLink(result.data);

    setUrl("");
    setOpen(false);
  }

  const triggerButton = (
    <Button variant={isLink ? "default" : "ghost"} size="icon" type="button">
      <IconLink />
    </Button>
  );

  return (
    <DrawerDialog open={open} onOpenChange={setOpen}>
      <DrawerDialogTrigger render={triggerButton} />
      <DrawerDialogContent>
        <DrawerDialogHeader>
          <DrawerDialogTitle>Add Link</DrawerDialogTitle>
          <DrawerDialogDescription>
            Add a link to the editor
          </DrawerDialogDescription>
        </DrawerDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={url}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLink();
              }
            }}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <DrawerDialogFooter>
          <Button type="button" onClick={handleLink}>
            <IconLink />
            Add Link
          </Button>
        </DrawerDialogFooter>
      </DrawerDialogContent>
    </DrawerDialog>
  );
}
