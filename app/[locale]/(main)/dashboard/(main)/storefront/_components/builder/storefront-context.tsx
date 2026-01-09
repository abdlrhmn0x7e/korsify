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
} from "@/convex/db/storefronts/validators";
import { toast } from "sonner";
import { FunctionReturnType } from "convex/server";

type TeacherWithBranding = NonNullable<
  FunctionReturnType<typeof api.teachers.queries.getTeacher>
>;

interface StorefrontContextType {
  storefront: {
    _id: string;
    theme: StorefrontTheme;
    style: StorefrontStyle;
    sections: Array<StorefrontSection>;
  } | null | undefined;
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
  toggleSectionVisibility: (sectionId: string, visible: boolean) => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
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
  const updateSectionMutation = useMutation(
    api.teachers.storefront.updateSection
  );
  const addSectionMutation = useMutation(api.teachers.storefront.addSection);
  const removeSectionMutation = useMutation(
    api.teachers.storefront.removeSection
  );
  const reorderSectionsMutation = useMutation(
    api.teachers.storefront.reorderSections
  );
  const updateStyleMutation = useMutation(api.teachers.storefront.updateStyle);
  const toggleVisibilityMutation = useMutation(
    api.teachers.storefront.toggleSectionVisibility
  );

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (storefront === null) {
      createFromTemplate({ templateId: "minimalist" })
        .then(() => toast.success("Created default storefront"))
        .catch(() => toast.error("Failed to create storefront"));
    }
  }, [storefront, createFromTemplate]);

  const updateSection = async (
    sectionId: string,
    updates: Partial<Pick<StorefrontSection, "variant" | "content" | "visible">>
  ) => {
    setIsSaving(true);
    setHasUnsavedChanges(true);
    try {
      await updateSectionMutation({
        sectionId,
        variant: updates.variant as string | undefined,
        content: updates.content,
        visible: updates.visible,
      });
      setHasUnsavedChanges(false);
    } catch {
      toast.error("Failed to update section");
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = async (
    type: StorefrontSection["type"],
    variant: string
  ) => {
    setIsSaving(true);
    try {
      await addSectionMutation({ type, variant });
      toast.success("Section added");
    } catch {
      toast.error("Failed to add section");
    } finally {
      setIsSaving(false);
    }
  };

  const removeSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to remove this section?")) return;

    setIsSaving(true);
    try {
      await removeSectionMutation({ sectionId });
      toast.success("Section removed");
      if (activeSectionId === sectionId) setActiveSectionId(null);
    } catch {
      toast.error("Failed to remove section");
    } finally {
      setIsSaving(false);
    }
  };

  const reorderSections = async (sectionIds: string[]) => {
    setIsSaving(true);
    try {
      await reorderSectionsMutation({ sectionIds });
    } catch {
      toast.error("Failed to reorder sections");
    } finally {
      setIsSaving(false);
    }
  };

  const updateStyle = async (updates: {
    theme?: StorefrontTheme;
    style?: StorefrontStyle;
  }) => {
    setIsSaving(true);
    try {
      await updateStyleMutation(updates);
      toast.success("Style updated");
    } catch {
      toast.error("Failed to update style");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSectionVisibility = async (
    sectionId: string,
    visible: boolean
  ) => {
    setIsSaving(true);
    try {
      await toggleVisibilityMutation({ sectionId, visible });
    } catch {
      toast.error("Failed to toggle visibility");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StorefrontContext.Provider
      value={{
        storefront,
        teacher,
        isLoading: storefront === undefined,
        activeSectionId,
        setActiveSectionId,
        updateSection,
        addSection,
        removeSection,
        reorderSections,
        updateStyle,
        toggleSectionVisibility,
        isSaving,
        hasUnsavedChanges,
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
