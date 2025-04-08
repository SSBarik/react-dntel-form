import React, { useEffect, useRef, useState } from "react";
import {
  DntelCodeSectionSchema,
  DntelFormProps,
  DntelSectionSchema,
} from "@types";
import { DntelSection } from "./DntelSection";
import DntelCodesSection from "./DntelCodesSection";

export const DntelForm: React.FC<DntelFormProps> = ({
  initialData,
  changes,
  changeValue,
  editMode,
  setEditMode,
  activeSection,
  scrollToSection,
  setActiveSection,
  expandedSections: externalExpandedSections,
  expandSection: externalExpandSection,
  collapseSection: externalCollapseSection,
}) => {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sortedSections = Object.entries(initialData.sections)
    .map(([key, section]) => ({ ...section, id: key }))
    .sort((a, b) => a.order - b.order);

  const allSectionIds = sortedSections.map((s) => s.id);

  const [internalExpandedSections, setInternalExpandedSections] =
    useState<string[]>(allSectionIds);

  const expanded = externalExpandedSections ?? internalExpandedSections;

  const expand =
    externalExpandSection ??
    ((id: string) => {
      setInternalExpandedSections((prev) =>
        prev.includes(id) ? prev : [...prev, id]
      );
    });

  const collapse =
    externalCollapseSection ??
    ((id: string) => {
      setInternalExpandedSections((prev) => prev.filter((sid) => sid !== id));
    });

  const expandAll = () => {
    if (externalExpandSection) {
      allSectionIds.forEach((id) => externalExpandSection(id));
    } else {
      setInternalExpandedSections(allSectionIds);
    }
  };

  const collapseAll = () => {
    if (externalCollapseSection) {
      allSectionIds.forEach((id) => externalCollapseSection(id));
    } else {
      setInternalExpandedSections([]);
    }
  };

  const isCodeSection = (
    section: DntelSectionSchema | DntelCodeSectionSchema
  ): section is DntelCodeSectionSchema => {
    return section.title === "Codes" && "module" in section;
  };

  const isServiceHistory = (section: { title: string }) => {
    return section.title === "Service History";
  };

  useEffect(() => {
    if (activeSection) {
      const el = sectionRefs.current[activeSection];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeSection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target) {
          const id = visible.target.getAttribute("data-section-id");
          if (id) setActiveSection?.(id);
        }
      },
      {
        rootMargin: "0px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    const elements = Object.values(sectionRefs.current).filter(Boolean);
    elements.forEach((el) => observer.observe(el!));

    return () => {
      elements.forEach((el) => observer.unobserve(el!));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Expand/Collapse All Buttons */}
      <div className="w-full flex justify-end gap-2 mb-4">
        <button
          onClick={expandAll}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Collapse All
        </button>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-6">
        {sortedSections.map((section) => {
          const refCallback = (el: HTMLDivElement | null) => {
            sectionRefs.current[section.id] = el;
          };

          if (isServiceHistory(section)) return null;

          return (
            <div
              key={section.id}
              ref={refCallback}
              data-section-id={section.id}
              className={`w-full ${
                section.layout === "left" || section.layout === "right"
                  ? "md:w-1/2"
                  : ""
              }`}
            >
              {isCodeSection(section) ? (
                <DntelCodesSection
                  section={section}
                  changes={changes}
                  changeValue={changeValue}
                  editMode={editMode}
                  expandedSections={expanded}
                  expandSection={expand}
                  collapseSection={collapse}
                />
              ) : (
                <DntelSection
                  section={section}
                  changes={changes}
                  changeValue={changeValue}
                  editMode={editMode}
                  expandedSections={expanded}
                  expandSection={expand}
                  collapseSection={collapse}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
