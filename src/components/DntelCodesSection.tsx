import React, { useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { DntelCodeSectionSchema, DntelFieldSchema } from "../types";

interface DntelCodesSectionProps {
  section: DntelCodeSectionSchema & { id: string };
  changes: { [key: string]: any };
  changeValue: (key: string, value: any) => void;
  editMode: boolean;
  scrollToSection: (id: string) => void;
  expandedSections: string[];
  expandSection: (id: string) => void;
  collapseSection: (id: string) => void;
}

export default function DntelCodesSection({
  section,
  changes,
  changeValue,
  editMode,
  scrollToSection,
  expandedSections,
  expandSection,
  collapseSection,
}: DntelCodesSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const entries = Object.entries(section.fields ?? {});

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const total = entries.reduce(
    (acc, [_, data]) => acc + (data.stats?.total || 0),
    0
  );
  const filled = entries.reduce(
    (acc, [_, data]) => acc + (data.stats?.filled || 0),
    0
  );

  const isOpen = expandedSections.includes(section.id);

  const handleToggle = () => {
    isOpen ? collapseSection(section.id) : expandSection(section.id);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 rounded-md bg-gray-50">
        <div className="text-xl font-semibold text-black">
          {section.title} ({filled}/{total})
        </div>
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-gray-700"
          onClick={handleToggle}
          aria-label="Toggle Codes Section"
        >
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </div>

      {isOpen && (
        <Card className="rounded-lg   ">
          <CardContent className="p-0">
            <div className="grid grid-cols-[45%_5%_5%_30%_10%] gap-4 p-4 font-semibold text-sm text-black bg-gray-50">
              <div>Code</div>
              <div>%</div>
              <div>Freq</div>
              <div>Additional Info</div>
              <div>Actions</div>
            </div>

            {entries.map(([code, data], idx) => (
              <div key={code} className="border-b">
                <div className="grid grid-cols-[45%_5%_5%_30%_10%] gap-4 p-4 items-center text-sm text-gray-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span>
                      {data.name} ({code})
                    </span>
                  </div>
                  <div>{data.coveragePercentage?.value || ""}</div>
                  <div>{data.frequency?.value || ""}</div>
                  <div>
                    {Object.keys(data.guidelines ?? {}).length > 0 ? (
                      <Button
                        variant="outline"
                        onClick={() => toggleExpand(idx)}
                        className="text-xs font-medium flex items-center gap-1 rounded-md px-2 py-1 "
                      >
                        Additional Info (
                        {Object.keys(data.guidelines ?? {}).length})
                        {expandedIndex === idx ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </Button>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div></div>
                </div>
                {expandedIndex === idx && (
                  <div className="col-span-5 px-4 pb-4">
                    <div className="mt-3 bg-gray-50 rounded-md p-4">
                      {Object.entries(data.guidelines ?? {}).length === 0 ? (
                        <div className="text-gray-600 text-sm">
                          No additional info available.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                          {Object.entries(data.guidelines ?? {}).map(
                            ([question, answer], gidx) => (
                              <div key={gidx} className="col-span-2">
                                <div className="font-semibold text-black mb-1">
                                  {question}
                                </div>
                                <div>
                                  {typeof answer.value === "boolean"
                                    ? answer.value.toString()
                                    : answer.value || "–"}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
