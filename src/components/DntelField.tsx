import React from "react";
import { DntelFieldProps } from "@types";
import { X, Info } from "lucide-react";

type SelectOption = { value: string; label: string };

const DntelField: React.FC<DntelFieldProps & { sectionId: string }> = ({
  field,
  value,
  onChange,
  editMode,
  sectionId,
}) => {
  const fieldType = field.interface?.type ?? "text";
  const label = field.title;

  const normalizedOptions: SelectOption[] =
    fieldType === "select" && Array.isArray(field.interface?.options)
      ? field.interface.options.map((opt: any) =>
          typeof opt === "string" ? { value: opt, label: opt } : opt
        )
      : [];

  const inputId = `${sectionId}-${field.key}`;

  const isMismatch = (() => {
    if (value === null || value === undefined || value === "") return false;

    if (fieldType === "boolean") return typeof value !== "boolean";
    if (fieldType === "select")
      return !normalizedOptions.find((opt) => opt.value === value);
    if (fieldType === "date") return !/^\d{4}-\d{2}-\d{2}$/.test(value);
    return false;
  })();

  const TooltipIcon = () =>
    field.tooltip ? (
      <span className="ml-1 inline-block align-middle" title={field.tooltip}>
        <Info size={14} className="text-gray-400 inline-block" />
      </span>
    ) : null;

  if (!editMode) {
    return (
      <div className="mb-4">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          <TooltipIcon />
        </label>
        <div id={inputId} className="mt-1 p-2 bg-gray-100 rounded">
          {fieldType === "boolean"
            ? value === true
              ? "Yes"
              : "No"
            : value?.toString() || "—"}
        </div>
      </div>
    );
  }

  const renderMismatchField = () => (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />
      <button
        type="button"
        onClick={() => onChange("")}
        className="text-red-500 hover:text-red-700"
        title="Reset value"
      >
        <X size={16} />
      </button>
    </div>
  );

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        <TooltipIcon />
      </label>

      {isMismatch ? (
        renderMismatchField()
      ) : fieldType === "boolean" ? (
        <input
          id={inputId}
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          disabled={field.disabled}
        />
      ) : fieldType === "select" ? (
        <select
          id={inputId}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          disabled={field.disabled}
        >
          <option value="" disabled>
            {field.placeholder || "Select an option"}
          </option>
          {normalizedOptions.map((option) => (
            <option key={`${field.key}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
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
