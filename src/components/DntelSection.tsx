import React, { useMemo } from "react";
import { DntelSectionProps } from "@types";
import DntelField from "@components/DntelField";

export const DntelSection: React.FC<DntelSectionProps> = ({
  section,
  changes,
  changeValue,
  editMode,
}) => {
  const preparedFields = useMemo(() => {
    return Object.entries(section.fields).map(([fieldKey, field]) => {
      const hasUserChange = Object.prototype.hasOwnProperty.call(
        changes,
        fieldKey
      );
      const value = hasUserChange
        ? changes[fieldKey]
        : field.value ?? field.defaultValue ?? "";
      return {
        key: `${section.id}-${fieldKey}`,
        field: { ...field, key: fieldKey },
        value,
      };
    });
  }, [section.fields, changes, section.id]);

  const stats = useMemo(() => {
    const total = preparedFields.length;
    const filled = preparedFields.filter(({ value }) => {
      return value !== null && value !== undefined && value !== "";
    }).length;
    return { total, filled };
  }, [preparedFields]);

  return (
    <div
      className="p-4 space-y-4 border rounded shadow"
      style={{ backgroundColor: section.bgColor || "#fff" }}
    >
      <h2 className="text-xl font-bold">
        {section.title}{" "}
        <span className="text-sm text-gray-500">
          {section.id} ({stats.filled}/{stats.total})
        </span>
      </h2>

      {section.tooltip && (
        <p className="text-sm text-gray-600">{section.tooltip}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {preparedFields.map(({ key, field, value }) => (
          <DntelField
            key={key}
            field={field}
            value={value}
            onChange={(val) => changeValue(field.key, val)}
            editMode={editMode}
            sectionId={section.id}
          />
        ))}
      </div>
    </div>
  );
};
