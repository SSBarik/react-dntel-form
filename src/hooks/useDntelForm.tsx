import { useCallback, useMemo, useState } from "react";
import { DntelFormHook } from "@types";
import { DntelForm } from "@components/DntelForm";

export function useDntelForm(initialData: any, id?: string): DntelFormHook {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [changes, setChanges] = useState<{ [key: string]: any }>({});

  const changeValue = useCallback((key: string, value: any) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
  }, []);

  const FormComponent = useMemo(
    () => (
      <DntelForm
        initialData={initialData}
        changes={changes}
        changeValue={changeValue}
        editMode={editMode}
        setEditMode={setEditMode}
      />
    ),
    [initialData, changes, changeValue, editMode]
  );

  return {
    FormComponent,
    changes,
    editMode,
    setEditMode,
  };
}
