import { BlindWine } from "@/types/questions";
import type { TypicalWine } from "@/types/wine";

export const Chardonnay: TypicalWine = {
  id: "wine_1",
  name: "Chardonnay",
  colorType: { white: 2, red: -1 },
  whiteColor: { yellow: 1, gold: 2 },
  acidQuantity: { medium: 2, high: -1 },
  acidQuality: { crisp: 1, zesty: 1 },
  alcoholQuantity: { low: -1, medium: 1, mediumPlus: 2 },
  alcoholQuality: { wellIntegrated: 1 },
  bodyQuantity: { light: -1, mediumPlus: 2, full: 1 },
  bodyQuality: { balanced: 1, complex: 2, sourFruitDriven: -1 },
  fruitRipeness: { ripe: 2, veryRipe: 1 },
  fruitIntensity: { medium: 2, mediumPlus: 1 },
  fruitConcentration: { medium: 2, mediumPlus: 1 },
  fruitRedCharacteristics: { blue: 2 },
  fruitRedFlavors: { blackberry: 1, blueberry: 2 },
  oakQuantity: { neutral: 1, new25: 2, new50: 1 },
  oakQuality: { french: 2 },
  oakFlavors: { vanilla: 1, spice: 1 },
  secondaryEarth: { flowersPerfume: 2 },
  secondaryMinerality: { graniteRocky: 1 },
  secondaryOther: { meaty: 1, peppery: 2, smoky: 1, savory: 2, gamey: 1 },
};

export const OregonPinot: TypicalWine = {
  id: "wine_2",
  name: "Pinot Noir",
  subname: "Oregon",
  colorType: { red: 2, white: -1 },
  redColor: { lightRuby: 1, mediumRuby: 2, darkRuby: 1 },
  sweetness: { dry: 2 },
  tanninQuantity: { low: 2, medium: 1, high: -1 },
  tanninQuality: { juicyFruity: 2, velvetySilky: 1 },
  tanninLocation: { tongue: 2, roofOfMouth: 2 },
  tanninPerception: { green: 1, fruity: 2 },
  acidQuantity: { low: -1, medium: 1, mediumPlus: 2, high: 1 },
  acidQuality: { crisp: 1, zesty: 1 },
  alcoholQuantity: { low: -1, mediumPlus: 2, high: 1 },
  alcoholQuality: { wellIntegrated: 2, soothing: 1, burning: -1 },
  bodyQuantity: { light: 1, medium: 2, full: -1 },
  bodyQuality: { balanced: 2, complex: 1 },
  fruitRipeness: { underripe: 1, ripe: 2, jammy: -1, cooked: -1 },
  fruitIntensity: { medium: 2, mediumPlus: 1, high: -1 },
  fruitConcentration: { medium: 2, mediumPlus: 1, high: -1 },
  fruitRedCharacteristics: { red: 2, black: 1, blue: -1 },
  fruitRedFlavors: { cherry: 2, cranberry: 1, blackberry: 1, blueberry: -1 },
  oakQuantity: { neutral: 1, new25: 2, new50: 1 },
  oakQuality: { french: 2 },
  oakFlavors: { vanilla: 1, spice: 1 },
  secondaryEarth: { richSoil: 1, mushroomy: 1, flowersPerfume: 1 },
  secondaryMinerality: { chalkyLimestone: 1 },
  secondaryOther: { savory: 2 },
};
