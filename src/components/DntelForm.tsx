// File: src/components/DntelForm.tsx
import React from "react";
import { DntelFormProps } from "@types";
import { DntelSection } from "./DntelSection";

export const DntelForm: React.FC<DntelFormProps> = ({
  initialData,
  changes,
  changeValue,
  editMode,
}) => {
  const sortedSections = Object.values(initialData.sections).sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="space-y-6">
      {sortedSections.map((section) => (
        <DntelSection
          key={section.id}
          section={section}
          changes={changes}
          changeValue={changeValue}
          editMode={editMode}
        />
      ))}
    </div>
  );
};
