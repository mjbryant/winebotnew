import { PENALTY, scoreAttribute } from "@/utils/scoring";
import { Chardonnay, OregonPinot } from "@/utils/sampleWines";
import { BlindWine, TemplateWine } from "@/types/questions";
import { deepCopy } from "@/utils/helpers";

const makeGuess = (fields: BlindWine): BlindWine => {
  const guess = { ...deepCopy(TemplateWine), ...fields };
  return guess;
};

describe("scoreAttribute", () => {
  it("returns 2 for a single exact match", () => {
    const guess = makeGuess({ colorType: { red: 2 } });
    expect(scoreAttribute("colorType", guess, OregonPinot)).toEqual(2);
    expect(scoreAttribute("colorType", guess, Chardonnay)).toEqual(PENALTY);
    expect(scoreAttribute("colorType", guess, TemplateWine)).toEqual(0);
  });
});
