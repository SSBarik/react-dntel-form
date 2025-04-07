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

  const layoutWrapperClass =
    section.layout === "left" || section.layout === "right"
      ? "w-full md:w-1/2 px-4"
      : "w-full px-4";

  const gridColClass =
    section.layout === "full" ? "grid-cols-2 sm:grid-cols-2" : "grid-cols-1"; // force single-column for left/right for better space

  return (
    <div
      className={`border rounded-lg shadow-md ${layoutWrapperClass} p-6`} // added p-6
      style={{ backgroundColor: section.bgColor || "#fff" }}
    >
      <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
        {" "}
        {/* added mb-4 */}
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
          {section.id} ({stats.filled}/{stats.total})
        </span>
      </h2>

      <div className={`grid ${gridColClass} gap-4 w-full`}>
        {preparedFields.map(({ key, field, value }) => {
          const colSpan = parseInt(String(field.colSpan || 2), 10);
          const colSpanClass = `col-span-${Math.min(colSpan, 12)}`;
          return (
            <div key={key} className={colSpanClass}>
              <DntelField
                field={field}
                value={value}
                onChange={(val) => changeValue(field.key, val)}
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
