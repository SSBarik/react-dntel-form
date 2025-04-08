import React, { useEffect, useMemo, useState } from "react";
import { DntelSectionProps } from "@types";
import DntelField from "@components/DntelField";
import { Info, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/Tooltip";

export const DntelSection: React.FC<DntelSectionProps> = ({
  section,
  changes,
  changeValue,
  editMode,
  expandedSections,
  expandSection,
  collapseSection,
}) => {
  const isOpen = expandedSections.includes(section.id);

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

  const gridColClass =
    section.layout === "full" ? "grid-cols-2 sm:grid-cols-2" : "grid-cols-1";

  const handleToggle = () => {
    isOpen ? collapseSection(section.id) : expandSection(section.id);
  };

  return (
    <div
      className="border rounded-lg shadow-md"
      style={{ backgroundColor: section.bgColor || "#fff" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 text-gray-800 text-xl font-semibold">
          {section.title}
          {section.tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="align-middle cursor-help">
                    <Info size={16} className="text-gray-400" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white px-2 py-1 rounded text-xs">
                  {section.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="text-sm text-gray-500 ml-1">
            ({stats.filled}/{stats.total})
          </span>
        </div>
        <button
          onClick={handleToggle}
          className="text-gray-500 hover:text-gray-700 transition"
          aria-label="Toggle section"
        >
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className={`grid ${gridColClass} gap-x-4 gap-y-6 p-4`}>
          {preparedFields.map(({ key, field, value }) => {
            const colSpan = Math.min(
              parseInt(String(field.colSpan || 2), 10),
              2
            );
            return (
              <div key={key} className={`col-span-${colSpan}`}>
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
      )}
    </div>
  );
};
