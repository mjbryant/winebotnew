import { BlindWine, Question } from "./questions";

export const QUESTION_ORDERS = [
  "default",
  "all_in_order",
  "random",
] as const;

export type QuestionOrder = typeof QUESTION_ORDERS[number];

export type Tasting = {
  id: string;
  questions: Question[];
  currentWine: BlindWine;
  // This should be a real type eventually
  topCandidates?: string[];
  questionOrder?: QuestionOrder;
  secondQuestionOverride?: Question;
  // The most prescriptive way to specify all questions in order. Mutually
  // exclusive with questionOrder and secondQuestionOverride and honestly
  // we should replace those.
  questionOrderOverride?: Question[];
  useQuestionOrderOverride?: boolean;
};
