import { FC } from "react";

export type DntelFieldType = "text" | "boolean" | "select" | "date";

export type DntelSectionLayout = "full" | "left" | "right";

export type DntelColSpan = 1 | 2;

export interface DntelStats {
  total: number;
  filled: number;
}

export interface DntelFieldInterface {
  type: DntelFieldType;
  options?: Array<string | { value: string; label: string }>;
}

export interface DntelFieldSchema {
  key: string;
  title: string;
  interface: DntelFieldInterface;
  options?: string[];
  defaultValue?: any;
  defaultOptions?: string[];
  value?: any;
  colSpan?: DntelColSpan;
  required?: boolean;
  hidden?: boolean;
  placeholder?: string;
  disabled?: boolean;
  tooltip?: string;
}

export interface DntelSectionSchema {
  id: string;
  title: string;
  order: number;
  layout?: DntelSectionLayout;
  tooltip?: string;
  bgColor?: string;
  fields: {
    [fieldKey: string]: DntelFieldSchema;
  };
  stats?: DntelStats;
}

export interface DntelFormSchema {
  sections: {
    [sectionId: string]: DntelSectionSchema;
  };
}

export interface DntelFieldProps {
  field: DntelFieldSchema;
  value: any;
  onChange: (val: any) => void;
  editMode: boolean;
}

export interface DntelSectionProps {
  section: DntelSectionSchema;
  changes: { [key: string]: any };
  changeValue: (key: string, value: any) => void;
  editMode: boolean;
  expandedSections: string[];
  expandSection: (id: string) => void;
  collapseSection: (id: string) => void;
}

export interface DntelFormHook {
  FormComponent: FC;
  changes: { [key: string]: any };
  activeSection: string;
  expandedSections: string[];
  lastChanged: number | null;
  expandAll: () => void;
  collapseAll: () => void;
  scrollToSection: (id: string) => void;
  expandSection: (id: string) => void;
  reset: () => void;
  changeValue: (key: string, value: any) => void;
  clearLS: () => void;
  editMode: boolean;
  setEditMode: (enabled: boolean) => void;
  saveChanges: () => void;
}

export interface DntelFormProps {
  initialData: DntelFormSchema;
  changes: { [key: string]: any };
  changeValue: (key: string, value: any) => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
  expandedSections: string[];
  expandSection: (id: string) => void;
  editMode: boolean;
  setEditMode: (enabled: boolean) => void;
  collapseSection: (id: string) => void;
  scrollToSection: (id: string) => void;
}

// 👇 Type for an individual field
export interface DntelFieldSchema {
  key: string;
  title: string;
  interface: DntelFieldInterface;
  options?: string[];
  defaultValue?: any;
  defaultOptions?: string[];
  value?: any;
  colSpan?: DntelColSpan;
  required?: boolean;
  hidden?: boolean;
  placeholder?: string;
  disabled?: boolean;
  tooltip?: string;
}

// 👇 Type for each code like "D0120", "D0140"
export interface DntelCodeEntry {
  frequency?: DntelFieldSchema;
  coveragePercentage?: DntelFieldSchema;
  guidelines?: Record<string, DntelFieldSchema>;
  name: string;
  friendlyName: string;
  stats?: DntelStats;
}

export interface DntelCodeSectionSchema {
  id: string;
  title: string;
  order: number;
  layout?: DntelSectionLayout;
  module: string;
  bgColor?: string;
  tooltip?: string;
  stats?: DntelStats;
  fields: {
    [codeId: string]: DntelCodeEntry;
  };
}
export interface DntelCodesSectionProps {
  section: DntelCodeSectionSchema;
  changes: { [key: string]: any };
  changeValue: (key: string, value: any) => void;
  editMode: boolean;
  expandedSections: string[];
  expandSection: (id: string) => void;
  collapseSection: (id: string) => void;
}
