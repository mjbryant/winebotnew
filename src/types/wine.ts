// 2  = best choice
// 1  = okay choice
// 0  = neutral
// -1 = terrible choice
export type N = 2 | 1 | 0 | -1;

export type LowToHigh = { low?: N; medium?: N; mediumPlus?: N; high?: N };
export type LightToFull = { light?: N; medium?: N; mediumPlus?: N; full?: N };
export type Ripeness = {
  underripe?: N;
  ripe?: N;
  veryRipe?: N;
  jammy?: N;
  cooked?: N;
};
const COLORS = ["red", "white"] as const;
export type Color = typeof COLORS[number];

export type Wine = {
  colorType?: { red?: N; white?: N };
  redColor?: { lightRuby?: N; mediumRuby?: N; darkRuby?: N; purple?: N };
  whiteColor?: {
    greenTinge?: N;
    paleLemon?: N;
    paleStraw?: N;
    straw?: N;
    yellow?: N;
    gold?: N;
    deepGold?: N;
  };

  sweetness?: { dry?: N; sweet?: N; offDry?: N };

  tanninQuantity?: LowToHigh;
  tanninQuality?: {
    sandy?: N;
    fineGrained?: N;
    chalky?: N;
    juicyFruity?: N;
    velvetySilky?: N;
    opulent?: N;
  };
  tanninStructure?: {
    loose?: N;
    tight?: N;
    knotted?: N;
    compact?: N;
    firm?: N;
  };
  tanninLocation?: {
    tongue?: N;
    gums?: N;
    front?: N;
    middle?: N;
    sides?: N;
    back?: N;
    roofOfMouth?: N;
  };
  tanninPerception?: { woodyStalky?: N; green?: N; fruity?: N };

  acidQuantity?: LowToHigh;
  acidQuality?: {
    soft?: N;
    crisp?: N;
    zesty?: N;
    searing?: N;
    bracing?: N;
    vibrant?: N;
    tangy?: N;
  };

  alcoholQuantity?: LowToHigh;
  alcoholQuality?: {
    wellIntegrated?: N;
    soothing?: N;
    warming?: N;
    burning?: N;
  };

  bodyQuantity?: LightToFull;
  bodyQuality?: {
    balanced?: N;
    complex?: N;
    ripeFruitDriven?: N;
    sourFruitDriven?: N;
    tanninDriven?: N;
    acidDriven?: N;
  };

  fruitRipeness?: Ripeness;
  fruitQuality?: {
    sour?: N;
    dusty?: N;
    dried?: N;
  };
  fruitIntensity?: LowToHigh;
  fruitConcentration?: LowToHigh;
  fruitRedCharacteristics?: { red?: N; black?: N; blue?: N };
  fruitWhiteCharacteristics?: {
    citrus?: N;
    orchard?: N;
    stoneFruit?: N;
    tropical?: N;
    melon?: N;
  };
  fruitRedFlavors?: {
    blackCherry?: N;
    cherry?: N;
    raspberry?: N;
    plum?: N;
    cranberry?: N;
    strawberry?: N;
    redcurrant?: N;
    mulberry?: N;
    blackcurrant?: N;
    blackberry?: N;
    blueberry?: N;
    cassis?: N;
  };
  fruitWhiteFlavors?: {
    lemonLime?: N;
    grapefruit?: N;
    apple?: N;
    pear?: N;
    peach?: N;
    nectarine?: N;
    guava?: N;
    lychee?: N;
    starfruit?: N;
    cantaloupe?: N;
    honeydew?: N;
  };

  oakQuantity?: { none?: N; neutral?: N; new25?: N; new50?: N; new100?: N };
  oakQuality?: { french?: N; american?: N; hungarian?: N };
  oakFlavors?: {
    vanilla?: N;
    cedar?: N;
    coconut?: N;
    dill?: N;
    spice?: N;
    tobacco?: N;
    toast?: N;
  };

  // Red secondary characteristics
  secondaryEarth?: {
    richSoil?: N;
    driedLeaves?: N;
    mushroomy?: N;
    stinkyPoopy?: N;
    forestFloor?: N;
    flowersPerfume?: N;
    dusty?: N;
    tar?: N;
    roses?: N;
    violets?: N;
  };
  secondaryMinerality?: {
    chalkyLimestone?: N;
    ironBlood?: N;
    medicinal?: N;
    graniteRocky?: N;
    salty?: N;
    gravelPencilShavings?: N;
  };
  secondaryPyrazines?: { bellpepper?: N; jalapeno?: N; grass?: N };
  secondaryOther?: {
    cloveAndHerbs?: N;
    teaLeaves?: N;
    tobacco?: N;
    leather?: N;
    meaty?: N;
    peppery?: N;
    smoky?: N;
    savory?: N;
    gamey?: N;
    worcestershire?: N;
    cola?: N;
    spicy?: N;
    amaro?: N;
    licorice?: N;
    truffle?: N;
  };

  // White secondary characteristics
  secondaryEarthWhite?: {
    earthy?: N;
    spicy?: N;
    salty?: N;
    chalkyMinerality?: N;
    stonyMinerality?: N;
    flintySmoky?: N;
    celery?: N;
    leafy?: N;
    petrol?: N;
    whitePepper?: N;
  };
  secondaryFloral?: {
    perfumeSoapy?: N;
    freshFlowers?: N;
    honeySuckle?: N;
    orangeBlossom?: N;
  };
  secondaryOtherWhite?: {
    butterCream?: N;
    popcorn?: N;
    doughy?: N;
    yeasty?: N;
    honey?: N;
    peachPit?: N;
    nuttiness?: N;
    funky?: N;
    ammonia?: N;
  };
};

export type Attribute = keyof Wine;

export type TypicalWine = Wine & {
  id: string;
  name: string;
  subname?: string;
};
