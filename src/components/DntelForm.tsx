import React, { useEffect, useRef } from "react";
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
  expandedSections,
  expandSection,
  collapseSection,
  activeSection,
  scrollToSection,
  setActiveSection,
}) => {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sortedSections = Object.entries(initialData.sections)
    .map(([key, section]) => ({ ...section, id: key }))
    .sort((a, b) => a.order - b.order);

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
        setActiveSection?.(activeSection);
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

    Object.entries(sectionRefs.current).forEach(([id, el]) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
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
            className="w-full"
          >
            {isCodeSection(section) ? (
              <DntelCodesSection
                section={section}
                changes={changes}
                changeValue={changeValue}
                editMode={editMode}
                expandedSections={expandedSections}
                expandSection={expandSection}
                collapseSection={collapseSection}
              />
            ) : (
              <DntelSection
                section={section}
                changes={changes}
                changeValue={changeValue}
                editMode={editMode}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
