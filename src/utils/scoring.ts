import { BlindWine, Question, Questions } from "@/types/questions";
import { Attribute, N, TypicalWine, Wine } from "@/types/wine";
import { colorSet, getDisplayName } from "./helpers";
import { appliesToColor } from "./questionHelpers";

export type Scores = {
  [key: string]: {
    score: number;
    name: string;
    subname?: string;
  };
};

export const PENALTY = -1000;

export const scoreValues = (value: N, templateValue: N): number => {
  // If templateValue is red (-1) then heavily penalize. Otherwise you get 2
  // points for matching the best answer and 1 point for matching the second
  // best answer. Question: how does this work for in-between things like
  // med to med+?
  switch (templateValue) {
    case -1:
      return value > 0 ? PENALTY : 0;
    case 0:
      // No score change
      return 0;
    case 1:
      if (value == 2) {
        return 1;
      } else if (value == 1) {
        // This shouldn't happen because I don't think we're going to allow
        // 1 ratings on answers. But if we ever do it seems logical to score
        // it like this.
        return 0.5;
      }
      return 0;
    case 2:
      if (value == 2) {
        return 2;
      } else if (value == 1) {
        return 1;
      }
      return 0;
    default:
      throw new Error(`Score for template values should only be -1 to 2`);
  }
};

export const scoreAttribute = (
  attributeName: Attribute,
  guess: Wine,
  wine: Wine,
): number => {
  const answer = guess[attributeName];
  const template = wine[attributeName];
  const questionConfig = Questions[attributeName];

  if (
    answer == undefined || template == undefined ||
    (colorSet(guess) && !appliesToColor(guess, questionConfig))
  ) {
    return 0;
  }

  // For a single attribute, we go through all the answers from the guess and
  // compare them to their counterpart on the typical wine.
  let score = 0;
  for (const entry of Object.entries(answer)) {
    const [key, value] = entry;
    if (key in template) {
      const templateValue = template[key as keyof typeof template];
      score += scoreValues(value, templateValue);
    } else {
      continue;
    }
  }
  return score;
};

const scoreWine = (guess: BlindWine, wine: Wine): number => {
  // The guess has a subset of the attributes of the typical wine. We just go through
  // all the attributes that exist on the guess and compare them to their counterpart
  // on the typical wine.
  let score = 0;
  for (const attribute of Object.keys(guess)) {
    const typedAttribute = attribute as Question;
    if (Questions[typedAttribute].unscored) {
      continue;
    }
    score += scoreAttribute(typedAttribute as Attribute, guess, wine);
  }
  return score;
};

export const scoreAllWines = (
  guess: BlindWine,
  wines: TypicalWine[],
): Scores => {
  /**
   * How do we score the answers?
   * 1. Remove all wines that aren't the same color
   * 2. Sum the differences from all fields that exist in answers
   * 3. Lowest different wins
   *
   * Eventually we'll want different weighting, since things like getting a
   * bunch of secondary flavors wrong is probably going to be common, while
   * entirely missing the mark on things like acidity will be less common.
   */
  const scores: Scores = {};

  for (const wine of wines) {
    scores[wine.id] = {
      score: scoreWine(guess, wine),
      name: wine.name,
      subname: wine.subname,
    };
  }
  return scores;
};

export const getTopCandidates = (scores: Scores): string[] => {
  const sortedScores = Object.values(scores).sort((a, b) => {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    } else {
      return 0;
    }
  });
  return sortedScores.slice(0, 2).map((s) => getDisplayName(s.name, s.subname));
};
