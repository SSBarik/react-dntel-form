import React from "react";
import { DntelFormProps } from "@types";

export const DntelForm: React.FC<DntelFormProps> = ({
  initialData,
  changes,
  changeValue,
  editMode,
}) => {
  const section = Object.values(initialData.sections)[0];
  const field = section.fields[0];
  const fieldKey = field.key;
  const value = changes[fieldKey] ?? field.defaultValue ?? "";

  return (
    <div className="p-4 space-y-4 border rounded shadow">
      <h2 className="text-xl font-bold">{section.title}</h2>
      <div className="flex flex-row">
        <label className="text-sm font-medium mb-1">{field.label}</label>
        {editMode ? (
          <input
            className="border rounded px-2 py-1"
            type="text"
            value={value}
            onChange={(e) => changeValue(fieldKey, e.target.value)}
          />
        ) : (
          <div className="bg-gray-100 p-2 rounded">{value || "—"}</div>
        )}
      </div>
    </div>
  );
};
