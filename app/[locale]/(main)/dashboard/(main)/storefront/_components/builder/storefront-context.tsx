"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Preloaded } from "convex/react";
import { useMutation } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { api } from "@/convex/_generated/api";
import {
  StorefrontSection,
  StorefrontTheme,
  StorefrontStyle,
  StorefrontTypography,
  defaultStorefrontTypography,
} from "@/convex/db/storefronts/validators";
import { toast } from "sonner";
import { FunctionReturnType } from "convex/server";

type TeacherWithBranding = NonNullable<
  FunctionReturnType<typeof api.teachers.queries.getTeacher>
>;

type StorefrontData = FunctionReturnType<typeof api.teachers.storefront.get>;
type StorefrontDraft = NonNullable<StorefrontData>;

function generateSectionId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function patchSectionContent(
  currentContent: Record<string, unknown>,
  updates: Record<string, unknown>
): Record<string, unknown> {
  const nextContent = { ...currentContent };

  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      delete nextContent[key];
      continue;
    }
    nextContent[key] = value;
  }

  return nextContent;
}

function shouldPatchContent(updates: Record<string, unknown>): boolean {
  return Object.values(updates).some((value) => value === null);
}

function getDefaultContent(
  type: StorefrontSection["type"]
): StorefrontSection["content"] {
  switch (type) {
    case "hero":
      return {
        headline: "Your Headline Here",
        subheadline: "Add your subheadline",
        ctaText: "Get Started",
        ctaLink: "/courses",
      };
    case "courses":
      return {
        title: "Our Courses",
        showPrice: true,
        showDuration: true,
        selectedCourseIds: [],
        viewAllLink: true,
      };
    case "about":
      return {
        title: "About",
        showStats: true,
      };
    case "testimonials":
      return {
        title: "What Students Say",
        items: [],
      };
    case "faq":
      return {
        title: "Frequently Asked Questions",
        items: [],
      };
    case "cta":
      return {
        headline: "Ready to Start?",
        buttonText: "Join Now",
        buttonLink: "/courses",
      };
  }
}

interface StorefrontContextType {
  storefront: StorefrontDraft | null | undefined;
  teacher: TeacherWithBranding | null | undefined;
  isLoading: boolean;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
  updateSection: (
    sectionId: string,
    updates: Partial<Pick<StorefrontSection, "variant" | "content" | "visible">>
  ) => void;
  addSection: (type: StorefrontSection["type"], variant: string) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sectionIds: string[]) => void;
  updateStyle: (updates: {
    theme?: StorefrontTheme;
    style?: StorefrontStyle;
  }) => void;
  updateTypography: (updates: Partial<StorefrontTypography>) => void;
  toggleSectionVisibility: (sectionId: string, visible: boolean) => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  saveChanges: () => Promise<void>;
}

const StorefrontContext = createContext<StorefrontContextType | undefined>(
  undefined
);

interface StorefrontProviderProps {
  children: ReactNode;
  preloadedStorefront: Preloaded<typeof api.teachers.storefront.get>;
  preloadedTeacher: Preloaded<typeof api.teachers.queries.getTeacher>;
}

export function StorefrontProvider({
  children,
  preloadedStorefront,
  preloadedTeacher,
}: StorefrontProviderProps) {
  const storefront = usePreloadedAuthQuery(preloadedStorefront);
  const teacher = usePreloadedAuthQuery(preloadedTeacher);

  const createFromTemplate = useMutation(
    api.teachers.storefront.createFromTemplate
  );
  const updateStorefrontMutation = useMutation(
    api.teachers.storefront.updateStorefront
  );

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [draftStorefront, setDraftStorefront] = useState<
    StorefrontDraft | null | undefined
  >(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (storefront === null) {
      createFromTemplate({ templateId: "minimalist" })
        .then(() => toast.success("Created default storefront"))
        .catch(() => toast.error("Failed to create storefront"));
    }
  }, [storefront, createFromTemplate]);

  useEffect(() => {
    if (storefront === undefined || hasUnsavedChanges) return;
    if (storefront === draftStorefront) return;

    setDraftStorefront(storefront);
  }, [storefront, hasUnsavedChanges, draftStorefront]);

  const updateDraft = (
    updater: (current: StorefrontDraft) => StorefrontDraft
  ) => {
    setDraftStorefront((current) => {
      if (!current) return current;
      return updater(current);
    });
    setHasUnsavedChanges(true);
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<Pick<StorefrontSection, "variant" | "content" | "visible">>
  ) => {
    updateDraft((current) => {
      const sections = current.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const nextContent = updates.content
          ? shouldPatchContent(updates.content as Record<string, unknown>)
            ? patchSectionContent(
                section.content as Record<string, unknown>,
                updates.content as Record<string, unknown>
              )
            : updates.content
          : section.content;

        return {
          ...section,
          ...(updates.variant !== undefined && { variant: updates.variant }),
          ...(updates.visible !== undefined && { visible: updates.visible }),
          ...(updates.content !== undefined && { content: nextContent }),
        } as StorefrontSection;
      });

      return { ...current, sections };
    });
  };

  const addSection = (type: StorefrontSection["type"], variant: string) => {
    updateDraft((current) => {
      const newSection: StorefrontSection = {
        id: generateSectionId(),
        type,
        variant: variant as StorefrontSection["variant"],
        visible: true,
        content: getDefaultContent(type),
      } as StorefrontSection;

      return { ...current, sections: [...current.sections, newSection] };
    });
  };

  const removeSection = (sectionId: string) => {
    updateDraft((current) => {
      const sections = current.sections.filter((s) => s.id !== sectionId);
      if (activeSectionId === sectionId) setActiveSectionId(null);
      return { ...current, sections };
    });
  };

  const reorderSections = (sectionIds: string[]) => {
    updateDraft((current) => {
      const sectionMap = new Map(
        current.sections.map((section) => [section.id, section])
      );
      const sections = sectionIds
        .map((id) => sectionMap.get(id))
        .filter((section): section is StorefrontSection => section !== undefined);

      return { ...current, sections };
    });
  };

  const updateStyle = (updates: {
    theme?: StorefrontTheme;
    style?: StorefrontStyle;
  }) => {
    updateDraft((current) => ({
      ...current,
      ...updates,
    }));
  };

  const updateTypography = (updates: Partial<StorefrontTypography>) => {
    updateDraft((current) => ({
      ...current,
      style: {
        ...current.style,
        typography: {
          ...defaultStorefrontTypography,
          ...(current.style.typography ?? {}),
          ...updates,
        },
      },
    }));
  };

  const toggleSectionVisibility = (sectionId: string, visible: boolean) => {
    updateSection(sectionId, { visible });
  };

  const saveChanges = async () => {
    if (!draftStorefront || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await updateStorefrontMutation({
        theme: draftStorefront.theme,
        style: draftStorefront.style,
        sections: draftStorefront.sections,
        cssVariables: draftStorefront.cssVariables,
      });
      setHasUnsavedChanges(false);
      toast.success("Storefront saved");
    } catch {
      toast.error("Failed to save storefront");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StorefrontContext.Provider
      value={{
        storefront: draftStorefront,
        teacher,
        isLoading: draftStorefront === undefined || draftStorefront === null,
        activeSectionId,
        setActiveSectionId,
        updateSection,
        addSection,
        removeSection,
        reorderSections,
        updateStyle,
        updateTypography,
        toggleSectionVisibility,
        isSaving,
        hasUnsavedChanges,
        saveChanges,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (context === undefined) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }
  return context;
}
