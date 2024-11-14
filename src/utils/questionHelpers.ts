import {
  InputType,
  Question,
  Questions,
  QuestionTemplate,
} from "@/types/questions";
import { LightToFull, LowToHigh, N, Ripeness, Wine } from "@/types/wine";
import { getColor } from "./helpers";

// This stuff is still soooooo bad. I need a generic way to map qualitative,
// arbitrary labels to sliders.

export const lowToHighToValue = (attribute: LowToHigh): number => {
  if (attribute.low == 2) {
    return 0;
  } else if (attribute.low == 1) {
    return 1;
  } else if (attribute.medium == 2) {
    return 2;
  } else if (attribute.medium == 1 && attribute.mediumPlus == 1) {
    return 3;
  } else if (attribute.mediumPlus == 2) {
    return 4;
  } else if (attribute.mediumPlus == 1 && attribute.high == 1) {
    return 5;
  } else if (attribute.high == 2) {
    return 6;
  } else if (Object.keys(attribute).length == 0) {
    return 3;
  } else {
    throw new Error(`Invalid LowToHigh input value: ${attribute}`);
  }
};

export const valueToLowToHigh = (value: number): LowToHigh => {
  if (value < 0 || value > 6) {
    throw new Error(`Invalid value to convert to LowToHigh: ${value}`);
  }
  const values: LowToHigh[] = [
    { low: 2 },
    { low: 1, medium: 1 },
    { medium: 2 },
    { medium: 1, mediumPlus: 1 },
    { mediumPlus: 2 },
    { mediumPlus: 1, high: 1 },
    { high: 2 },
  ];
  return values[value];
};

export const lightToFullToValue = (attribute: LightToFull): number => {
  if (attribute.light == 2) {
    return 0;
  } else if (attribute.light == 1) {
    return 1;
  } else if (attribute.medium == 2) {
    return 2;
  } else if (attribute.medium == 1 && attribute.mediumPlus == 1) {
    return 3;
  } else if (attribute.mediumPlus == 2) {
    return 4;
  } else if (attribute.mediumPlus == 1 && attribute.full == 1) {
    return 5;
  } else if (attribute.full == 2) {
    return 6;
  } else if (Object.keys(attribute).length == 0) {
    // the default
    return 3;
  } else {
    throw new Error(
      `Invalid LightToFull input value: ${JSON.stringify(attribute)}`,
    );
  }
};

export const valueToLightToFull = (value: number): LightToFull => {
  if (value < 0 || value > 6) {
    throw new Error(`Invalid value to convert to LightToFull: ${value}`);
  }
  const values: LightToFull[] = [
    { light: 2 },
    { light: 1, medium: 1 },
    { medium: 2 },
    { medium: 1, mediumPlus: 1 },
    { mediumPlus: 2 },
    { mediumPlus: 1, full: 1 },
    { full: 2 },
  ];
  return values[value];
};

export const ripenessToValue = (attribute: Ripeness): number => {
  if (attribute.underripe == 2) {
    return 0;
  } else if (attribute.underripe == 1) {
    return 1;
  } else if (attribute.ripe == 2) {
    return 2;
  } else if (attribute.ripe == 1 && attribute.veryRipe == 1) {
    return 3;
  } else if (attribute.veryRipe == 2) {
    return 4;
  } else if (attribute.veryRipe == 1 && attribute.jammy == 1) {
    return 5;
  } else if (attribute.jammy == 2) {
    return 6;
  } else if (attribute.jammy == 1 && attribute.cooked == 1) {
    return 7;
  } else if (attribute.cooked == 2) {
    return 8;
  } else if (Object.keys(attribute).length == 0) {
    return 4;
  } else {
    throw new Error(`Invalid LowToHigh input value: ${attribute}`);
  }
};

export const valueToRipeness = (value: number): Ripeness => {
  if (value < 0 || value > 8) {
    throw new Error(`Invalid value to convert to LowToHigh: ${value}`);
  }
  const values: Ripeness[] = [
    { underripe: 2 },
    { underripe: 1, ripe: 1 },
    { ripe: 2 },
    { ripe: 1, veryRipe: 1 },
    { veryRipe: 2 },
    { veryRipe: 1, jammy: 1 },
    { jammy: 2 },
    { jammy: 1, cooked: 1 },
    { cooked: 2 },
  ];
  return values[value];
};

export const appliesToColor = (
  wine: Wine,
  questionConfig: QuestionTemplate,
): boolean => {
  const appliesTo = questionConfig.appliesTo;
  if (!appliesTo) return true;
  const color = getColor(wine);
  if (color == null) {
    throw new Error(
      `Must only call appliesToColor if colorSet(wine) == true`,
    );
  }
  return appliesTo == color;
};

export const allowsNoInput = (question: Question): boolean => {
  const questionTemplate = Questions[question];
  return !!questionTemplate.allowNone ||
    questionTemplate.inputType == InputType.Slider;
};

export const numSelected = (attribute: { [key: string]: N }): number => {
  let num = 0;
  for (const value of Object.values(attribute)) {
    if (value == 2) {
      num += 1;
    }
    // could also error on value = 1 here, since it's not expected, but
    // probably not necessary right now.
  }
  return num;
};

export const getInitialSubmitText = (question: Question): string | null => {
  // If the question allows you to select none and proceed, make the submit button enabled
  // with different text. Submit button is also always enabled for sliders.
  const questionTemplate = Questions[question];
  if (questionTemplate.inputType == InputType.Slider) {
    return "Submit";
  } else if (questionTemplate.allowNone) {
    return "Skip";
  } else {
    return null;
  }
};
