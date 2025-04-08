import React, { useMemo } from "react";
import { DntelSectionProps } from "@types";
import DntelField from "@components/DntelField";
import { Info } from "lucide-react";

export const DntelSection: React.FC<DntelSectionProps> = ({
  section,
  changes,
  changeValue,
  editMode,
}) => {
  const preparedFields = useMemo(() => {
    return Object.entries(section.fields).map(([fieldKey, field]) => {
      const fullKey = `${section.id}.${fieldKey}`;
      const hasUserChange = Object.prototype.hasOwnProperty.call(
        changes,
        fullKey
      );
      const value = hasUserChange
        ? changes[fullKey]
        : field.value ?? field.defaultValue ?? "";
      return {
        key: fullKey,
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

  const layoutWrapperClass =
    section.layout === "left" || section.layout === "right"
      ? "w-full md:w-1/2"
      : "w-full px-4";

  const gridColClass =
    section.layout === "full" ? "grid-cols-2 sm:grid-cols-2" : "grid-cols-1";

  console.log("section", section);
  return (
    <div
      className={`border rounded-lg shadow-md ${layoutWrapperClass}`}
      style={{ backgroundColor: section.bgColor || "#fff" }}
    >
      <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
        {section.title}
        {section.tooltip && (
          <span
            className="ml-2 align-middle inline-block"
            title={section.tooltip}
          >
            <Info size={16} className="inline-block text-gray-400" />
          </span>
        )}
        <span className="text-sm text-gray-500 ml-2">
          ({stats.filled}/{stats.total})
        </span>
      </h2>

      <div className={`grid ${gridColClass} gap-x-4 gap-y-6 w-full`}>
        {preparedFields.map(({ key, field, value }) => {
          const colSpan = parseInt(String(field.colSpan || 2), 10);
          const colSpanClass = `col-span-${Math.min(colSpan, 12)}`;
          return (
            <div key={key} className={colSpanClass}>
              <DntelField
                field={field}
                value={value}
                onChange={(val) =>
                  changeValue(`${section.id}.${field.key}`, val)
                }
                editMode={editMode}
                sectionId={section.id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
