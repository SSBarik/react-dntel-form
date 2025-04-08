import { useCallback, useMemo, useRef, useState } from "react";
import { DntelFormHook } from "@types";
import { DntelForm } from "@components/DntelForm";

export function useDntelForm(initialData: any, id?: string): DntelFormHook {
  const STORAGE_KEY = id ? `dntel-changes-${id}` : "dntel-changes";

  const [editMode, setEditModeState] = useState<boolean>(false);
  const [savedData, setSavedData] = useState<{ [key: string]: any }>({});
  const [changes, setChanges] = useState<{ [key: string]: any }>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<number | null>(null);

  const getCurrentData = useCallback(() => {
    return { ...savedData, ...changes };
  }, [savedData, changes]);

  const changeValue = useCallback(
    (key: string, value: any) => {
      setChanges((prev) => {
        const updated = { ...prev, [key]: value };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setLastChanged(Date.now());
    },
    [STORAGE_KEY]
  );

  const expandSection = useCallback((id: string) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const collapseSection = useCallback((id: string) => {
    setExpandedSections((prev) => prev.filter((s) => s !== id));
  }, []);

  const expandAll = useCallback(() => {
    const allKeys = Object.keys(initialData.sections).flatMap((sectionId) => {
      const section = initialData.sections[sectionId];
      if (section.title === "Codes") {
        return Object.keys(section.fields).map(
          (codeKey) => `${section.id}.${codeKey}`
        );
      }
      return section.id;
    });
    setExpandedSections(allKeys);
  }, [initialData]);

  const collapseAll = useCallback(() => {
    setExpandedSections([]);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  const reset = useCallback(() => {
    setChanges({});
    setSavedData({});
    setLastChanged(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [STORAGE_KEY]);

  const clearLS = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChanges({});
  }, [STORAGE_KEY]);

  const saveChanges = useCallback(() => {
    setSavedData((prev) => ({ ...prev, ...changes }));
    setChanges({});
    localStorage.removeItem(STORAGE_KEY);
    setEditModeState(false);
  }, [changes, STORAGE_KEY]);

  const setEditMode = useCallback(
    (edit: boolean) => {
      if (edit) {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          setChanges(stored ? JSON.parse(stored) : {});
        } catch {
          setChanges({});
        }
      } else {
        setChanges({});
        // Don't touch localStorage — keep the draft!
      }
      setEditModeState(edit);
    },
    [STORAGE_KEY]
  );

  const FormComponent = useMemo(
    () => (
      <DntelForm
        initialData={initialData}
        changes={getCurrentData()}
        changeValue={changeValue}
        editMode={editMode}
        setEditMode={setEditMode}
        expandedSections={expandedSections}
        expandSection={expandSection}
        collapseSection={collapseSection}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        scrollToSection={(id) => {
          scrollToSection(id);
        }}
      />
    ),
    [
      initialData,
      changes,
      savedData,
      getCurrentData,
      changeValue,
      editMode,
      setEditMode,
      expandedSections,
      expandSection,
      collapseSection,
      activeSection,
      scrollToSection,
    ]
  );

  return {
    FormComponent,
    changes: getCurrentData(),
    activeSection,
    expandedSections,
    lastChanged,
    editMode,
    setEditMode,
    expandAll,
    collapseAll,
    scrollToSection,
    expandSection,
    reset,
    changeValue,
    clearLS,
    saveChanges,
  };
}
