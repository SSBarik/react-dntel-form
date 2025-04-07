// File: src/components/DntelSection.tsx
import React from "react";
import { DntelSectionProps } from "@types";
import DntelField from "@components/DntelFiled";

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
        {section.fields.map((field) => {
          const value =
            changes[field.key] ?? field.value ?? field.defaultValue ?? "";
          return (
            <DntelField
              key={field.key}
              field={field}
              value={value}
              onChange={(val) => changeValue(field.key, val)}
              editMode={editMode}
            />
          );
        })}
      </div>
    </div>
  );
};
