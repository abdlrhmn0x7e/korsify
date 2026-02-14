"use client";

import { useStorefront } from "../storefront-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StorefrontSection, FaqItem } from "@/convex/db/storefronts/validators";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface FaqEditorProps {
  section: StorefrontSection & { type: "faq" };
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function FaqEditor({ section }: FaqEditorProps) {
  const { updateSection } = useStorefront();
  const [content, setContent] = useState(section.content);

  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    if (JSON.stringify(debouncedContent) !== JSON.stringify(section.content)) {
      updateSection(section.id, { content: debouncedContent });
    }
  }, [debouncedContent, section.id, section.content, updateSection]);

  function handleTitleChange(value: string) {
    setContent((prev) => ({ ...prev, title: value }));
  }

  function handleAddItem() {
    const newItem: FaqItem = {
      id: generateId(),
      question: "",
      answer: "",
    };
    setContent((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  }

  function handleUpdateItem(
    id: string,
    field: keyof Omit<FaqItem, "id">,
    value: string
  ) {
    setContent((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }

  function handleRemoveItem(id: string) {
    setContent((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Frequently Asked Questions"
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label>Questions & Answers</Label>
          <Button variant="outline" size="sm" onClick={handleAddItem}>
            <IconPlus className="h-4 w-4 mr-1" />
            Add Question
          </Button>
        </div>

        {content.items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No questions added yet. Click "Add Question" to create one.
          </p>
        )}

        {content.items.map((item, index) => (
          <div
            key={item.id}
            className="p-3 border rounded-lg bg-muted/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Question {index + 1}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveItem(item.id)}
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Question</Label>
              <Input
                value={item.question}
                onChange={(e) =>
                  handleUpdateItem(item.id, "question", e.target.value)
                }
                placeholder="What will I learn in this course?"
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Answer</Label>
              <Textarea
                value={item.answer}
                onChange={(e) =>
                  handleUpdateItem(item.id, "answer", e.target.value)
                }
                placeholder="Provide a detailed answer..."
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
