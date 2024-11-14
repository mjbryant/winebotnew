import { promises as fs } from "fs";
import { QuestionOrder, Tasting } from "@/types/tasting";
import { Question } from "@/types/questions";
import { generateRandom } from "./random";

const DATA_DIR = "./data/tastings";

export const createTastingSession = async (
  questionOrder: QuestionOrder,
  secondQuestionOverride: Question | "",
  questionOrderOverride: Question[],
): Promise<string> => {
  const id = `ts_${generateRandom(10)}`;
  let firstQuestion: Question = "colorType";
  if (questionOrderOverride.length > 0) {
    firstQuestion = questionOrderOverride.shift()!;
  }
  const tasting: Tasting = {
    id,
    questions: [firstQuestion],
    currentWine: {},
    secondQuestionOverride: secondQuestionOverride === ""
      ? undefined
      : secondQuestionOverride,
    questionOrder,
    questionOrderOverride,
    useQuestionOrderOverride: questionOrderOverride.length > 0,
  };
  await fs.writeFile(`${DATA_DIR}/${tasting.id}.json`, JSON.stringify(tasting));
  return id;
};

export const updateTastingSession = async (tasting: Tasting) => {
  await fs.writeFile(`${DATA_DIR}/${tasting.id}.json`, JSON.stringify(tasting));
};

export const getTasting = async (id: string): Promise<Tasting> => {
  try {
    const filename = `${id}.json`;
    const raw = await fs.readFile(`${DATA_DIR}/${filename}`, "utf-8");
    return JSON.parse(raw) as Tasting;
  } catch {
    throw new Error("404");
  }
};
