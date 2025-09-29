import { IconTypes } from "solid-icons";
import * as allBsIcons from "solid-icons/bs";
import * as allFaIcons from "solid-icons/fa";
import { Component, createSignal } from "solid-js";
import { WatchtowerConfig } from "../config";

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function getDynamicIcon(iconKey: string): IconTypes {
  // 1. Construct the key for the icon object.
  // Icon names in the `solid-icons` library are exported in PascalCase, prefixed with "Bs".
  // e.g., "cloud" becomes "BsCloud", "arrowLeft" becomes "BsArrowLeft".
  // const iconKey = `Bs${name.charAt(0).toUpperCase() + name.slice(1)}`;

  // 2. Look up the icon component in the imported object of all icons.
  // We cast the imported module to a record of string keys and Component values for type safety.
  const IconComponent = iconKey.startsWith("Bs")
    ? (allBsIcons as Record<string, Component>)[iconKey]
    : (allFaIcons as Record<string, Component>)[iconKey];

  // 3. Return the found component, or the fallback icon if the key does not exist.
  return IconComponent || allBsIcons.BsCloudFill;
}

export type TimeRange = {
  from_ms: number;
  to_ms: number;
};

export type CameraEvent = {
  from_ms: number;
  to_ms?: number;
  type: "motion" | "detection" | "threat" | "dangerous" | "threat_mitigated";
  label: string;
  icon: string;
};

export type Mark = {
  is_minor?: boolean;
  at_ms: number;
};

export const COLORS: Record<
  CameraEvent["type"],
  { border: string; bg: string; text: string }
> = {
  motion: {
    border: "border-neutral-600",
    bg: "bg-neutral-500/30",
    text: "text-neutral-500",
  },
  threat: {
    border: "border-yellow-600",
    bg: "bg-yellow-500/30",
    text: "text-yellow-500",
  },
  threat_mitigated: {
    border: "border-green-600",
    bg: "bg-green-500/30",
    text: "text-green-500",
  },
  dangerous: {
    border: "border-red-600",
    bg: "bg-red-500/30",
    text: "text-red-500",
  },
  detection: {
    border: "border-blue-600",
    bg: "bg-blue-500/30",
    text: "text-blue-500",
  },
};

export const buildMarks = (range: TimeRange) => {
  const numMarks = 10;
  const interval = (range.to_ms - range.from_ms) / numMarks;
  const result: Mark[] = [];
  for (let i = 0; i <= numMarks; i++) {
    const at_ms = range.from_ms + i * interval;
    result.push({
      at_ms,
    });
  }

  const minorMarks: Mark[] = [];
  const numMinorMarks = 5;
  for (let i = 0; i < result.length; i++) {
    const mark = result[i];
    const nextMark = result[i + 1];
    if (!nextMark) break;

    const minorInterval = (nextMark.at_ms - mark.at_ms) / numMinorMarks;
    for (let j = 1; j < numMinorMarks; j++) {
      const at_ms = mark.at_ms + j * minorInterval;
      minorMarks.push({ at_ms, is_minor: true });
    }
  }

  return [...result, ...minorMarks];
};

export const [config, setConfig] = createSignal<WatchtowerConfig>();
export const [selectedStreamId, setSelectedStreamId] = createSignal<string>();
