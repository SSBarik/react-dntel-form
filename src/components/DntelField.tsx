import React from "react";
import { DntelFieldProps, DntelFieldType } from "@types";

const DntelField: React.FC<DntelFieldProps> = ({
  field,
  value,
  onChange,
  editMode,
}) => {
  if (field.hidden) return null;

  const commonProps = {
    className: "border rounded px-2 py-1 w-full",
    placeholder: field.placeholder,
    disabled: field.disabled,
  };

  const fieldType: DntelFieldType = field.interface?.type ?? "text";

  return (
    <div className={`mb-4 col-span-${field.colSpan || 1}`}>
      <label className="text-sm font-medium block mb-1">
        {field.title}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {editMode ? (
        <input
          type={fieldType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...commonProps}
        />
      ) : (
        <div className="bg-gray-100 p-2 rounded min-h-[2.5rem]">
          {value || field.defaultValue || "—"}
        </div>
      )}
      {field.tooltip && (
        <div className="text-xs text-gray-500 mt-1">{field.tooltip}</div>
      )}
    </div>
  );
};

export default DntelField;
