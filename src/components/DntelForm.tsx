import React, { useEffect, useRef, useState } from "react";
import {
  DntelCodeSectionSchema,
  DntelFormProps,
  DntelSectionSchema,
} from "@types";
import { DntelSection } from "./DntelSection";
import DntelCodesSection from "./DntelCodesSection";

const DntelForm: React.FC<DntelFormProps> = ({
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
  const isManualScrollRef = useRef(false);

  const sortedSections = Object.entries(initialData.sections)
    .map(([key, section]) => ({ ...section, id: key }))
    .sort((a, b) => a.order - b.order);

  const allSectionIds = sortedSections.map((s) => s.id);

  const [internalExpandedSections, setInternalExpandedSections] = useState<
    string[]
  >(() => allSectionIds);

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

  const isCodeSection = (
    section: DntelSectionSchema | DntelCodeSectionSchema
  ): section is DntelCodeSectionSchema => {
    return section.title === "Codes" && "module" in section;
  };

  const isServiceHistory = (section: { title: string }) => {
    return section.title === "Service History";
  };

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      isManualScrollRef.current = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        isManualScrollRef.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    if (activeSection && !isManualScrollRef.current) {
      scrollTo(activeSection);
    }
  }, [activeSection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target && !isManualScrollRef.current) {
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
    <div className="flex flex-wrap gap-y-6">
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
              section.layout === "left"
                ? "w-1/2"
                : section.layout === "right"
                ? "w-1/2 ml-auto"
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
                scrollToSection={scrollTo}
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
  );
};

export default DntelForm;
