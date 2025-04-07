// File: src/components/DntelSection.tsx
import React from "react";
import { DntelSectionProps } from "@types";
import DntelField from "@components/DntelField";

export const DntelSection: React.FC<DntelSectionProps> = ({
  section,
  changes,
  changeValue,
  editMode,
}) => {
  return (
    <div
      className="p-4 space-y-4 border rounded shadow"
      style={{ backgroundColor: section.bgColor || "#fff" }}
    >
      <h2 className="text-xl font-bold">{section.title}</h2>
      {section.tooltip && (
        <p className="text-sm text-gray-600">{section.tooltip}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(section.fields).map(([fieldKey, field]) => {
          const value =
            changes[fieldKey] ?? field.value ?? field.defaultValue ?? "";
          return (
            <DntelField
              key={`${section.id}-${fieldKey}`}
              field={{ ...field, key: fieldKey }}
              value={value}
              onChange={(val) => changeValue(fieldKey, val)}
              editMode={editMode}
            />
          );
        })}
      </div>
    </div>
  );
};
