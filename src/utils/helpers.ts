import { Color, Wine } from "@/types/wine";

export const deepCopy = <T>(wine: T): T => {
  return JSON.parse(JSON.stringify(wine)) as T;
};

export const getDisplayName = (name: string, subname?: string): string => {
  let displayName = name;
  if (subname) {
    displayName += ` (${subname})`;
  }
  return displayName;
};

export const colorSet = (wine: Wine): boolean => {
  return wine.colorType != undefined;
};

export const getColor = (wine: Wine): Color | null => {
  const colorType = wine.colorType;
  if (!colorType) return null;
  return colorType.red == 2 ? "red" : "white";
};

const UPPERCASE = /[A-Z]/g;

export const prettify = (s: string): string => {
  // If it's already uppercase, just return it
  if (s[0].toUpperCase() == s[0]) {
    return s;
  } else if (s === "new25") {
    return "25% new";
  } else if (s === "new50") {
    return "50% new";
  } else if (s === "new100") {
    return "100% new";
  }
  let r = s.replaceAll(UPPERCASE, (f) => " " + f.toLowerCase());
  return r[0].toUpperCase() + r.slice(1);
};
