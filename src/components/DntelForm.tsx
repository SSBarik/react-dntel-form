// File: src/components/DntelForm.tsx
import React from "react";
import {
  DntelCodeSectionSchema,
  DntelFormProps,
  DntelSectionSchema,
} from "@types";
import { DntelSection } from "./DntelSection";
import DntelCodesSection from "./DntelCodesSection";

export const DntelForm: React.FC<DntelFormProps> = ({
  initialData,
  changes,
  changeValue,
  editMode,
  setEditMode,
  expandedSections,
  expandSection,
  collapseSection,
}) => {
  const sortedSections = Object.entries(initialData.sections)
    .map(([key, section]) => ({ ...section, id: key }))
    .sort((a, b) => a.order - b.order);

  const isCodeSection = (
    section: DntelSectionSchema | DntelCodeSectionSchema
  ): section is DntelCodeSectionSchema => {
    return section.title === "Codes" && "module" in section;
  };

  const isServiceHistory = (section: { title: string }) => {
    return section.title === "Service History";
  };

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-6">
      {sortedSections.map((section) =>
        isServiceHistory(section) ? null : isCodeSection(section) ? (
          <DntelCodesSection
            key={section.id}
            section={section}
            changes={changes}
            changeValue={changeValue}
            editMode={editMode}
            expandedSections={expandedSections}
            expandSection={expandSection}
            collapseSection={collapseSection}
          />
        ) : (
          <DntelSection
            key={section.id}
            section={section}
            changes={changes}
            changeValue={changeValue}
            editMode={editMode}
          />
        )
      )}
    </div>
  );
};
