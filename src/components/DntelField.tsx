import React from "react";
import { DntelFieldProps } from "@types";

const DntelField: React.FC<DntelFieldProps> = ({
  field,
  value,
  onChange,
  editMode,
}) => {
  const fieldType = field.interface?.type ?? "text";
  const label = field.title;

  if (!editMode) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 p-2 bg-gray-100 rounded">
          {value?.toString() || "—"}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {fieldType === "boolean" ? (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          disabled={field.disabled}
        />
      ) : (
        <input
          type={fieldType}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          placeholder={field.placeholder}
          disabled={field.disabled}
        />
      )}
    </div>
  );
};

export default DntelField;
