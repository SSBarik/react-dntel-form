import React, { useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  DntelCodeSectionSchema,
  DntelCodeEntry,
  DntelFieldSchema,
} from "../types";

interface DntelCodesSectionProps {
  section: DntelCodeSectionSchema;
  changes: Record<string, string | boolean>;
  changeValue: (key: string, value: string | boolean) => void;
  editMode: boolean;
}

export default function DntelCodesSection({
  section,
  changes,
  changeValue,
  editMode,
}: DntelCodesSectionProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggleOpen = (code: string) => {
    setOpen((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  return (
    <div className="w-full">
      {Object.entries(section.fields).map(([codeKey, codeEntry]) => {
        const openKey = `${section.id}.${codeKey}`;
        const isOpen = open[openKey] || false;

        return (
          <Card key={codeKey} className="mb-6 bg-white shadow rounded-xl">
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-primary">
                    {codeEntry.friendlyName} ({codeKey})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Code information
                  </p>
                </div>
                {codeEntry.guidelines && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOpen(openKey)}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {codeEntry.frequency && (
                  <div className="space-y-1">
                    <Label htmlFor={`frequency-${codeKey}`}>Frequency</Label>
                    {editMode ? (
                      <Input
                        id={`frequency-${codeKey}`}
                        value={codeEntry.frequency.value || ""}
                        onChange={(e) =>
                          changeValue(
                            `${section.id}.${codeKey}.frequency`,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <div>{codeEntry.frequency.value || "-"}</div>
                    )}
                  </div>
                )}

                {codeEntry.coveragePercentage && (
                  <div className="space-y-1">
                    <Label htmlFor={`coverage-${codeKey}`}>
                      Coverage Percentage
                    </Label>
                    {editMode ? (
                      <Input
                        id={`coverage-${codeKey}`}
                        value={codeEntry.coveragePercentage.value || ""}
                        onChange={(e) =>
                          changeValue(
                            `${section.id}.${codeKey}.coveragePercentage`,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <div>{codeEntry.coveragePercentage.value || "-"}</div>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <Label>Actions</Label>
                  <div className="text-muted-foreground">—</div>
                </div>
              </div>

              {codeEntry.guidelines && isOpen && (
                <div className="pt-4">
                  <Separator className="mb-4" />
                  <h4 className="font-medium text-sm mb-2">Guidelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(codeEntry.guidelines).map(
                      ([gKey, gField]) => (
                        <div key={gKey} className="space-y-1">
                          <Label htmlFor={`guideline-${codeKey}-${gKey}`}>
                            {gField.title}
                          </Label>
                          {editMode ? (
                            gField.interface.type === "boolean" ? (
                              <input
                                type="checkbox"
                                id={`guideline-${codeKey}-${gKey}`}
                                checked={Boolean(gField.value)}
                                onChange={(e) =>
                                  changeValue(
                                    `${section.id}.${codeKey}.guidelines.${gKey}`,
                                    e.target.checked
                                  )
                                }
                              />
                            ) : (
                              <Input
                                id={`guideline-${codeKey}-${gKey}`}
                                value={gField.value || ""}
                                onChange={(e) =>
                                  changeValue(
                                    `${section.id}.${codeKey}.guidelines.${gKey}`,
                                    e.target.value
                                  )
                                }
                              />
                            )
                          ) : (
                            <div>
                              {gField.interface.type === "boolean"
                                ? gField.value
                                  ? "Yes"
                                  : "No"
                                : gField.value || "-"}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
