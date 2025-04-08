import { useCallback, useMemo, useState } from "react";
import { DntelFormHook } from "@types";
import { DntelForm } from "@components/DntelForm";

export function useDntelForm(initialData: any, id?: string): DntelFormHook {
  const [editMode, setEditModeState] = useState<boolean>(false);
  const [savedData, setSavedData] = useState<{ [key: string]: any }>({});
  const [changes, setChanges] = useState<{ [key: string]: any }>({});
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<number | null>(null);

  const getCurrentData = useCallback(() => {
    return { ...savedData, ...changes };
  }, [savedData, changes]);

  const changeValue = useCallback((key: string, value: any) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
    setLastChanged(Date.now());
  }, []);

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
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const reset = useCallback(() => {
    setChanges({});
    setSavedData({});
    setLastChanged(null);
  }, []);

  const clearLS = useCallback(() => {
    localStorage.clear();
  }, []);

  // Save changes
  const saveChanges = useCallback(() => {
    setSavedData((prev) => ({ ...prev, ...changes }));
    setChanges({});
    setEditModeState(false);
  }, [changes]);

  // Custom setEditMode handles cancel behavior when turning edit mode off
  const setEditMode = useCallback((edit: boolean) => {
    if (!edit) {
      // cancel edit
      setChanges({});
    }
    setEditModeState(edit);
  }, []);

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
    ]
  );

  return {
    FormComponent,
    changes: getCurrentData(),
    activeSection,
    expandedSections,
    lastChanged,
    editMode,
    setEditMode, // this now handles cancel internally
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
