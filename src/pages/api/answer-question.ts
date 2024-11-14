import type { NextApiRequest, NextApiResponse } from "next";
import { updateTastingSession } from "@/utils/tastingDatabase";
import { Tasting } from "@/types/tasting";
import { getWines } from "@/utils/database";
import {
  BlindWine,
  PrimaryCharacteristic,
  PrimaryCharacteristics,
  Question,
  Questions,
} from "@/types/questions";
import { getTopCandidates, scoreAllWines, Scores } from "@/utils/scoring";
import { getColor } from "@/utils/helpers";

const getLastQuestion = (tasting: Tasting): Question => {
  return tasting.questions[0];
};

const getPrimaryCharacteristics = (
  wine: BlindWine,
): PrimaryCharacteristics => {
  const primaryCharacteristics = wine.primaryCharacteristics;
  if (!primaryCharacteristics) {
    throw new Error(
      `'Cannot have primaryCharacteristics answer without actual answers`,
    );
  }
  return primaryCharacteristics;
};

const getNextFromPrimaryCharacteristics = (
  primaryCharacteristics: PrimaryCharacteristics,
): Question => {
  if (primaryCharacteristics.dryness == 2) {
    return "tanninQuantity";
  } else if (primaryCharacteristics.zestiness == 2) {
    return "acidQuantity";
  } else if (primaryCharacteristics.alcohol == 2) {
    return "alcoholQuantity";
  } else if (primaryCharacteristics.oakiness == 2) {
    return "oakQuantity";
  } else {
    return "fruitIntensity";
  }
};

// Things in setA that aren't in setB
function setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const _difference = new Set(setA);
  setB.forEach((elem) => {
    _difference.delete(elem);
  });
  return _difference;
}

const OMITTED_QUESTIONS: Question[] = [
  "tanninLocation",
  "tanninStructure",
  "tanninQuality",
  "tanninPerception",
  "acidQuality",
  "bodyQuality",
  "fruitConcentration",
  "oakFlavors",
  "oakQuality",
];

const randomRemaining = (tasting: Tasting): Question | null => {
  const alreadyAsked = new Set(tasting.questions);
  const color = getColor(tasting.currentWine);
  if (!color) {
    throw new Error(`Must have color set`);
  }

  const remainingQuestions = Object.entries(Questions).filter((entry) => {
    const [question, questionTemplate] = entry;
    const typedQuestion = question as Question;
    if (alreadyAsked.has(typedQuestion)) {
      return false;
    } else {
      return !questionTemplate.appliesTo ||
        (questionTemplate.appliesTo === color);
    }
  }).map((entry) => entry[0]);

  if (remainingQuestions.length == 0) {
    return null;
  }
  return remainingQuestions[
    Math.floor(Math.random() * remainingQuestions.length)
  ] as Question;
};

const getPrimaryQuestion = (question: Question): PrimaryCharacteristic => {
  if (question === "tanninQuantity") {
    return "dryness";
  } else if (question === "acidQuantity") {
    return "zestiness";
  } else if (question === "alcoholQuantity") {
    return "alcohol";
  } else if (question === "oakQuantity") {
    return "oakiness";
  } else {
    return "fruitiness";
  }
};

const getNextFromAfterPrimaryCharacteristics = (
  tasting: Tasting,
  question: Question,
): Question | null => {
  const secondToLastQuestion = tasting.questions[1];
  if (secondToLastQuestion === "primaryCharacteristics") {
    // If there's another selection, return it.
    // If not, return randomRemaining
    const primaryCharacteristics = getPrimaryCharacteristics(
      tasting.currentWine,
    );
    const primaryQuestion = getPrimaryQuestion(question);
    const remainingPrimaryAnswers = new Map(
      Object.entries(primaryCharacteristics)
        .filter((entry) => {
          const [primaryCharacteristic, _] = entry;
          return (primaryCharacteristic !== primaryQuestion);
        }),
    );
    return getNextFromPrimaryCharacteristics(
      remainingPrimaryAnswers as PrimaryCharacteristics,
    );
  } else {
    // Otherwise, the third-to-last question is primaryCharacteristics,
    // so we just move on. Eventually we should probably prioritize the
    // other primaryCharacteristics questions, but 🤷‍♂️
    return randomRemaining(tasting);
  }
};

export const getNextQuestionDeterministic = (
  tasting: Tasting,
): Question | null => {
  const lastQuestion = getLastQuestion(tasting);
  switch (lastQuestion) {
    case "colorType":
      if (getColor(tasting.currentWine) == "red") {
        return "redColor";
      } else {
        return "whiteColor";
      }
    case "redColor":
    case "whiteColor":
      return "sweetness";
    case "sweetness":
      return "bodyQuantity";
    case "bodyQuantity":
      return "primaryCharacteristics";
    case "primaryCharacteristics":
      return getNextFromPrimaryCharacteristics(
        getPrimaryCharacteristics(tasting.currentWine),
      );
    case "tanninQuantity":
    case "acidQuantity":
    case "alcoholQuantity":
    case "oakQuantity":
    case "fruitIntensity":
      // These mean that either the last or the second-to-last question
      // was primaryCharacteristics. Now we need to grab either the remaining
      // selected answer or just skip ahead if there's only one answer.
      return getNextFromAfterPrimaryCharacteristics(tasting, lastQuestion);
    default:
      return randomRemaining(tasting);
  }
};

export const getNextQuestionInOrder = (tasting: Tasting): Question | null => {
  const lastQuestion = getLastQuestion(tasting);
  const filteredQuestions = Object.entries(Questions).filter((entry) => {
    const [question, questionTemplate] = entry;
    if (
      !questionTemplate.appliesTo ||
      getColor(tasting.currentWine) == questionTemplate.appliesTo
    ) {
      return true;
    } else {
      return false;
    }
  }).map((entry) => entry[0]);
  const index = filteredQuestions.indexOf(lastQuestion);
  if (index < 0) {
    throw new Error(`Question ${lastQuestion} not found in Questions`);
  } else if (index == filteredQuestions.length - 1) {
    return null;
  } else {
    return filteredQuestions[index + 1] as Question;
  }
};

type Data = {
  tasting: Tasting;
  scores: Scores;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const tasting = req.body["tasting"] as Tasting;
  const currentWine = req.body["currentWine"] as BlindWine;

  tasting.currentWine = currentWine;

  // Should cache these or something
  const wines = await getWines();
  const scores = scoreAllWines(currentWine, wines);

  let nextQuestion: Question | null = null;
  if (tasting.useQuestionOrderOverride && tasting.questionOrderOverride) {
    // This captures both empty and populated lists.
    if (tasting.questionOrderOverride.length == 0) {
      nextQuestion = null;
    } else {
      nextQuestion = tasting.questionOrderOverride.shift()!;
    }
  } else {
    if (
      getLastQuestion(tasting) === "colorType" && tasting.secondQuestionOverride
    ) {
      nextQuestion = tasting.secondQuestionOverride;
    } else {
      if (tasting.questionOrder === "all_in_order") {
        nextQuestion = getNextQuestionInOrder(tasting);
      } else if (tasting.questionOrder === "random") {
        nextQuestion = randomRemaining(tasting);
      } else {
        // Default ordering is prescribed
        nextQuestion = getNextQuestionDeterministic(tasting);
      }
    }
  }

  if (nextQuestion == null) {
    // This means we're done
    tasting.topCandidates = getTopCandidates(scores);
    await updateTastingSession(tasting);
  } else {
    tasting.questions.unshift(nextQuestion);
    await updateTastingSession(tasting);
  }

  res.status(200).json({ tasting, scores });
}
