import type { FieldPath, FieldValues } from "react-hook-form";

/**
 * Represents a single step in a multi-step form wizard.
 */
export type FormStep<T extends FieldValues> = {
  /** Unique identifier for the step */
  id: string;
  /** Display title for the step */
  title: string;
  /** Optional description text */
  description?: string;
  /** Fields to validate when moving to next step */
  fields: FieldPath<T>[];
  /** React component to render for this step */
  component: React.ComponentType;
};
