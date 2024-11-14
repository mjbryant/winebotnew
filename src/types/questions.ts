import {
  lightToFullToValue,
  lowToHighToValue,
  ripenessToValue,
  valueToLightToFull,
  valueToLowToHigh,
  valueToRipeness,
} from "@/utils/questionHelpers";
import { Color, N, Wine } from "./wine";

export enum InputType {
  OneOf,
  Multiple,
  Slider,
}

export type PrimaryCharacteristics = {
  dryness?: N;
  zestiness?: N;
  alcohol?: N;
  oakiness?: N;
  fruitiness?: N;
};

export type PrimaryCharacteristic = keyof PrimaryCharacteristics;

export type BlindWine = Wine & {
  primaryCharacteristics?: PrimaryCharacteristics;
};

// Just an alias for all the possible wine characteristics
export type Question = keyof BlindWine;

export type QuestionTemplate = {
  inputType: InputType;
  questionText: string;
  appliesTo?: Color;
  unscored?: boolean;
  // Discrete input options
  allowNone?: boolean;
  maxAllowed?: number;
  // Slider input options
  max?: number;
  // This is hacky, but it seems like it's easier to define it here and just call
  // it in the tasting page
  valueToAttribute?: (value: number) => Object;
  attributeToValue?: (attribute: Object) => number;
};

export const Questions: { [key in Question]: QuestionTemplate } = {
  colorType: {
    inputType: InputType.OneOf,
    questionText: "What color is the wine?",
  },
  redColor: {
    inputType: InputType.OneOf,
    appliesTo: "red",
    questionText: "What are the detailed red color notes?",
  },
  whiteColor: {
    inputType: InputType.OneOf,
    appliesTo: "white",
    questionText: "What are the detailed white color notes?",
  },
  sweetness: {
    inputType: InputType.OneOf,
    questionText: "Is the wine sweet or dry?",
  },
  tanninQuantity: {
    inputType: InputType.Slider,
    appliesTo: "red",
    questionText: "How tannic is the wine?",
    attributeToValue: lowToHighToValue,
    valueToAttribute: valueToLowToHigh,
  },
  tanninQuality: {
    inputType: InputType.OneOf,
    appliesTo: "red",
    questionText: "What are the qualities of the tannins?",
  },
  tanninStructure: {
    inputType: InputType.OneOf,
    appliesTo: "red",
    questionText: "What is the structure of the tannins?",
  },
  tanninLocation: {
    inputType: InputType.OneOf,
    appliesTo: "red",
    questionText: "Where do the tannins hit your mouth?",
  },
  tanninPerception: {
    inputType: InputType.OneOf,
    appliesTo: "red",
    questionText: "How do you perceive the tannins?",
  },
  acidQuantity: {
    inputType: InputType.Slider,
    questionText: "How acidic is the wine?",
    attributeToValue: lowToHighToValue,
    valueToAttribute: valueToLowToHigh,
  },
  acidQuality: {
    inputType: InputType.OneOf,
    questionText: "What is the quality of acidity?",
  },
  alcoholQuantity: {
    inputType: InputType.Slider,
    questionText: "How much alcohol does the wine have?",
    attributeToValue: lowToHighToValue,
    valueToAttribute: valueToLowToHigh,
  },
  alcoholQuality: {
    inputType: InputType.OneOf,
    questionText: "What's the quality of alcohol?",
  },
  bodyQuantity: {
    inputType: InputType.Slider,
    questionText: "How full-bodied is the wine?",
    attributeToValue: lightToFullToValue,
    valueToAttribute: valueToLightToFull,
  },
  bodyQuality: {
    inputType: InputType.OneOf,
    questionText: "What's the body quality?",
  },
  fruitRipeness: {
    inputType: InputType.Slider,
    attributeToValue: ripenessToValue,
    valueToAttribute: valueToRipeness,
    questionText: "How ripe is the fruit in the wine?",
  },
  fruitQuality: {
    inputType: InputType.OneOf,
    questionText: "What's the quality of fruit?",
  },
  fruitIntensity: {
    inputType: InputType.Slider,
    questionText: "What is the aromatic intensity?",
    attributeToValue: lowToHighToValue,
    valueToAttribute: valueToLowToHigh,
  },
  fruitConcentration: {
    inputType: InputType.Slider,
    questionText: "How concentrated is the fruit?",
    attributeToValue: lowToHighToValue,
    valueToAttribute: valueToLowToHigh,
  },
  fruitRedCharacteristics: {
    inputType: InputType.Multiple,
    appliesTo: "red",
    maxAllowed: 2,
    questionText: "What kinds of fruit do you taste? (Pick up to two)",
    allowNone: true,
  },
  fruitWhiteCharacteristics: {
    inputType: InputType.Multiple,
    appliesTo: "white",
    maxAllowed: 2,
    questionText: "What kinds of fruit do you taste? (Pick up to two)",
    allowNone: true,
  },
  fruitRedFlavors: {
    inputType: InputType.Multiple,
    appliesTo: "red",
    maxAllowed: 4,
    questionText:
      "Let's drill down into specific fruits. Taste any of these? (Pick up to four)",
    allowNone: true,
  },
  fruitWhiteFlavors: {
    inputType: InputType.Multiple,
    appliesTo: "white",
    maxAllowed: 4,
    questionText:
      "Let's drill down into specific fruits. Taste any of these? (Pick up to four)",
    allowNone: true,
  },
  oakQuantity: {
    inputType: InputType.OneOf,
    questionText: "How oaky is the wine?",
  },
  oakQuality: {
    inputType: InputType.OneOf,
    questionText: "What's the quality of oakiness?",
  },
  oakFlavors: {
    inputType: InputType.Multiple,
    maxAllowed: 2,
    questionText:
      "More about oakiness: which of these do you taste? (Pick up to two)",
    allowNone: true,
  },
  secondaryEarth: {
    inputType: InputType.Multiple,
    maxAllowed: 4,
    questionText:
      "Which of these earthy flavors do you taste? (Pick up to four)",
    allowNone: true,
    appliesTo: "red",
  },
  secondaryMinerality: {
    inputType: InputType.Multiple,
    maxAllowed: 4,
    questionText:
      "Which of these mineral flavors do you taste? (Pick up to four)",
    allowNone: true,
  },
  secondaryPyrazines: {
    inputType: InputType.Multiple,
    maxAllowed: 2,
    questionText: "Which of these green flavors do you taste? (Pick up to two)",
    allowNone: true,
  },
  secondaryOther: {
    inputType: InputType.Multiple,
    maxAllowed: 4,
    questionText:
      "Which of these other flavors do you taste? (Pick up to four)",
    allowNone: true,
  },
  secondaryEarthWhite: {
    inputType: InputType.Multiple,
    maxAllowed: 4,
    questionText:
      "Which of these earthy flavors do you taste? (Pick up to four)",
    allowNone: true,
    appliesTo: "white",
  },
  secondaryFloral: {
    inputType: InputType.Multiple,
    maxAllowed: 4,
    questionText:
      "Which of these floral flavors do you taste? (Pick up to four)",
    allowNone: true,
    appliesTo: "white",
  },
  secondaryOtherWhite: {
    inputType: InputType.Multiple,
    maxAllowed: 4,
    questionText:
      "Which of these other flavors do you taste? (Pick up to four)",
    allowNone: true,
    appliesTo: "white",
  },
  primaryCharacteristics: {
    inputType: InputType.Multiple,
    maxAllowed: 2,
    questionText:
      "Which of these characteristics jumps out first? (Pick up to two)",
    unscored: true,
  },
};

export const TemplateWine: BlindWine = {
  colorType: { red: 0, white: 0 },
  redColor: { lightRuby: 0, mediumRuby: 0, darkRuby: 0, purple: 0 },
  whiteColor: {
    greenTinge: 0,
    paleLemon: 0,
    paleStraw: 0,
    straw: 0,
    yellow: 0,
    gold: 0,
    deepGold: 0,
  },
  sweetness: { dry: 0, sweet: 0, offDry: 0 },
  tanninQuantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  tanninQuality: {
    sandy: 0,
    fineGrained: 0,
    chalky: 0,
    juicyFruity: 0,
    velvetySilky: 0,
    opulent: 0,
  },
  tanninStructure: { loose: 0, tight: 0, knotted: 0, compact: 0, firm: 0 },
  tanninLocation: {
    tongue: 0,
    gums: 0,
    front: 0,
    middle: 0,
    sides: 0,
    back: 0,
    roofOfMouth: 0,
  },
  tanninPerception: { woodyStalky: 0, green: 0, fruity: 0 },
  acidQuantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  acidQuality: {
    soft: 0,
    crisp: 0,
    zesty: 0,
    searing: 0,
    bracing: 0,
    vibrant: 0,
    tangy: 0,
  },
  alcoholQuantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  alcoholQuality: { wellIntegrated: 0, soothing: 0, warming: 0, burning: 0 },
  bodyQuantity: { light: 0, medium: 0, mediumPlus: 0, full: 0 },
  bodyQuality: {
    balanced: 0,
    complex: 0,
    ripeFruitDriven: 0,
    sourFruitDriven: 0,
    tanninDriven: 0,
    acidDriven: 0,
  },
  fruitRipeness: {
    underripe: 0,
    ripe: 0,
    veryRipe: 0,
    jammy: 0,
    cooked: 0,
  },
  fruitQuality: { sour: 0, dusty: 0, dried: 0 },
  fruitIntensity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  fruitConcentration: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  fruitRedCharacteristics: { red: 0, black: 0, blue: 0 },
  fruitWhiteCharacteristics: {
    citrus: 0,
    orchard: 0,
    stoneFruit: 0,
    tropical: 0,
    melon: 0,
  },
  fruitRedFlavors: {
    blackCherry: 0,
    cherry: 0,
    raspberry: 0,
    plum: 0,
    cranberry: 0,
    strawberry: 0,
    redcurrant: 0,
    mulberry: 0,
    blackcurrant: 0,
    blackberry: 0,
    blueberry: 0,
    cassis: 0,
  },
  fruitWhiteFlavors: {
    lemonLime: 0,
    grapefruit: 0,
    apple: 0,
    pear: 0,
    peach: 0,
    nectarine: 0,
    guava: 0,
    lychee: 0,
    starfruit: 0,
    cantaloupe: 0,
    honeydew: 0,
  },
  oakQuantity: { none: 0, neutral: 0, new25: 0, new50: 0, new100: 0 },
  oakQuality: { french: 0, american: 0, hungarian: 0 },
  oakFlavors: {
    vanilla: 0,
    cedar: 0,
    coconut: 0,
    dill: 0,
    spice: 0,
    tobacco: 0,
    toast: 0,
  },
  secondaryEarth: {
    richSoil: 0,
    driedLeaves: 0,
    mushroomy: 0,
    stinkyPoopy: 0,
    forestFloor: 0,
    flowersPerfume: 0,
    dusty: 0,
    tar: 0,
    roses: 0,
    violets: 0,
  },
  secondaryMinerality: {
    chalkyLimestone: 0,
    ironBlood: 0,
    medicinal: 0,
    graniteRocky: 0,
    salty: 0,
    gravelPencilShavings: 0,
  },
  secondaryPyrazines: { bellpepper: 0, jalapeno: 0, grass: 0 },
  secondaryOther: {
    cloveAndHerbs: 0,
    teaLeaves: 0,
    tobacco: 0,
    leather: 0,
    meaty: 0,
    peppery: 0,
    smoky: 0,
    savory: 0,
    gamey: 0,
    worcestershire: 0,
    cola: 0,
    spicy: 0,
    amaro: 0,
    licorice: 0,
    truffle: 0,
  },
  secondaryEarthWhite: {
    earthy: 0,
    spicy: 0,
    salty: 0,
    chalkyMinerality: 0,
    stonyMinerality: 0,
    flintySmoky: 0,
    celery: 0,
    leafy: 0,
    petrol: 0,
    whitePepper: 0,
  },
  secondaryFloral: {
    perfumeSoapy: 0,
    freshFlowers: 0,
    honeySuckle: 0,
    orangeBlossom: 0,
  },
  secondaryOtherWhite: {
    butterCream: 0,
    popcorn: 0,
    doughy: 0,
    yeasty: 0,
    honey: 0,
    peachPit: 0,
    nuttiness: 0,
    funky: 0,
    ammonia: 0,
  },
  primaryCharacteristics: {
    dryness: 0,
    zestiness: 0,
    alcohol: 0,
    oakiness: 0,
    fruitiness: 0,
  },
};
