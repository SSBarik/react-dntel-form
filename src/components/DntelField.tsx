import React from "react";
import { DntelFieldProps } from "@types";

type SelectOption = { value: string; label: string };

const DntelField: React.FC<DntelFieldProps> = ({
  field,
  value,
  onChange,
  editMode,
}) => {
  const fieldType = field.interface?.type ?? "text";
  const label = field.title;

  const normalizedOptions: SelectOption[] =
    fieldType === "select" && Array.isArray(field.interface?.options)
      ? field.interface.options.map((opt: any) =>
          typeof opt === "string" ? { value: opt, label: opt } : opt
        )
      : [];

  if (!editMode) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {label} <span className="text-xs text-gray-400">({field.key})</span>
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
        {label} <span className="text-xs text-gray-400">({field.key})</span>
      </label>
      {fieldType === "boolean" ? (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          disabled={field.disabled}
        />
      ) : fieldType === "select" ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          disabled={field.disabled}
        >
          <option value="" disabled>
            {field.placeholder || "Select an option"}
          </option>
          {normalizedOptions.map((option: SelectOption) => (
            <option key={`${field.key}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
