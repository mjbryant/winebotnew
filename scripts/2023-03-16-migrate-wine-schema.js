const fs = require('fs');

const oldTemplate = {
  id: "",
  name: "",
  subname: "",
  colorType: { red: 0, white: 0 },
  redColor: { lightRuby: 0, mediumRuby: 0, darkRuby: 0, purple: 0 },
  whiteColor: { pale: 0, straw: 0, yellow: 0, gold: 0 },
  sweetness: { dry: 0, sweet: 0 },
  tannin: {
    quantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
    quality: { sandy: 0, fineGrained: 0, chalky: 0, juicyFruity: 0, velvetySilky: 0, opulent: 0, },
    structure: { loose: 0, tight: 0, knotted: 0, compact: 0, firm: 0 },
    location: { tongue: 0, gums: 0, front: 0, middle: 0, sides: 0, back: 0, roofOfMouth: 0, },
    perception: { woodyStalky: 0, green: 0, fruity: 0 },
  },
  acid: {
    quantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
    quality: { soft: 0, crisp: 0, zesty: 0, searing: 0, bracing: 0, vibrant: 0, tangy: 0, },
  },
  alcohol: {
    quantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
    quality: { wellIntegrated: 0, soothing: 0, warming: 0, burning: 0 },
  },
  body: {
    quantity: { light: 0, medium: 0, mediumPlus: 0, full: 0 },
    quality: { balanced: 0, complex: 0, ripeFruitDriven: 0, sourFruitDriven: 0, tanninDriven: 0, acidDriven: 0, },
  },
  fruit: {
    ripeness: { underripe: 0, ripe: 0, veryRipe: 0, jammy: 0, cooked: 0, },
    quality: { sour: 0, dusty: 0, dried: 0 },
    intensity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
    concentration: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
    redCharacteristics: { red: 0, black: 0, blue: 0 },
    whiteCharacteristics: { citrus: 0, orchard: 0, stoneFruit: 0, tropical: 0, melon: 0, },
    redFlavors: { blackCherry: 0, cherry: 0, raspberry: 0, plum: 0, cranberry: 0, strawberry: 0, redcurrant: 0, mulberry: 0, blackcurrant: 0, blackberry: 0, blueberry: 0, cassis: 0, },
    whiteFlavors: { lemonLime: 0, grapefruit: 0, apple: 0, pear: 0, peach: 0, nectarine: 0, guava: 0, lychee: 0, starfruit: 0, cantaloupe: 0, honeydew: 0, },
  },
  oak: {
    quantity: { none: 0, neutral: 0, new25: 0, new50: 0, new100: 0 },
    quality: { french: 0, american: 0, hungarian: 0 },
    flavors: { vanilla: 0, cedar: 0, coconut: 0, dill: 0, spice: 0, tobacco: 0, },
  },

  secondary: {
    earth: { richSoil: 0, driedLeaves: 0, mushroomy: 0, stinkyPoopy: 0, forestFloor: 0, flowersPerfume: 0, dusty: 0, tar: 0, roses: 0, violets: 0, none: 0, },
    minerality: { chalkyLimestone: 0, ironBlood: 0, medicinal: 0, graniteRocky: 0, salty: 0, gravelPencilShavings: 0, none: 0, },
    pyrazines: { bellpepper: 0, jalapeno: 0, grass: 0, none: 0 },
    other: { cloveAndHerbs: 0, teaLeaves: 0, tobacco: 0, leather: 0, meaty: 0, peppery: 0, smoky: 0, savory: 0, gamey: 0, worcestershire: 0, cola: 0, spicy: 0, amaro: 0, licorice: 0, truffle: 0, none: 0, },
  },
};

const newTemplate = {
  colorType: { red: 0, white: 0 },
  redColor: { lightRuby: 0, mediumRuby: 0, darkRuby: 0, purple: 0 },
  whiteColor: { pale: 0, straw: 0, yellow: 0, gold: 0 },
  sweetness: { dry: 0, sweet: 0 },
  tanninQuantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  tanninQuality: { sandy: 0, fineGrained: 0, chalky: 0, juicyFruity: 0, velvetySilky: 0, opulent: 0, },
  tanninStructure: { loose: 0, tight: 0, knotted: 0, compact: 0, firm: 0 },
  tanninLocation: { tongue: 0, gums: 0, front: 0, middle: 0, sides: 0, back: 0, roofOfMouth: 0, },
  tanninPerception: { woodyStalky: 0, green: 0, fruity: 0 },
  acidQuantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  acidQuality: { soft: 0, crisp: 0, zesty: 0, searing: 0, bracing: 0, vibrant: 0, tangy: 0, },
  alcoholQuantity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  alcoholQuality: { wellIntegrated: 0, soothing: 0, warming: 0, burning: 0 },
  bodyQuantity: { light: 0, medium: 0, mediumPlus: 0, full: 0 },
  bodyQuality: { balanced: 0, complex: 0, ripeFruitDriven: 0, sourFruitDriven: 0, tanninDriven: 0, acidDriven: 0, },
  fruitRipeness: { underripe: 0, ripe: 0, veryRipe: 0, jammy: 0, cooked: 0, },
  fruitQuality: { sour: 0, dusty: 0, dried: 0 },
  fruitIntensity: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  fruitConcentration: { low: 0, medium: 0, mediumPlus: 0, high: 0 },
  fruitRedCharacteristics: { red: 0, black: 0, blue: 0 },
  fruitWhiteCharacteristics: { citrus: 0, orchard: 0, stoneFruit: 0, tropical: 0, melon: 0, },
  fruitRedFlavors: { blackCherry: 0, cherry: 0, raspberry: 0, plum: 0, cranberry: 0, strawberry: 0, redcurrant: 0, mulberry: 0, blackcurrant: 0, blackberry: 0, blueberry: 0, cassis: 0, },
  fruitWhiteFlavors: { lemonLime: 0, grapefruit: 0, apple: 0, pear: 0, peach: 0, nectarine: 0, guava: 0, lychee: 0, starfruit: 0, cantaloupe: 0, honeydew: 0, },
  oakQuantity: { none: 0, neutral: 0, new25: 0, new50: 0, new100: 0 },
  oakQuality: { french: 0, american: 0, hungarian: 0 },
  oakFlavors: { vanilla: 0, cedar: 0, coconut: 0, dill: 0, spice: 0, tobacco: 0, },
  secondaryEarth: { richSoil: 0, driedLeaves: 0, mushroomy: 0, stinkyPoopy: 0, forestFloor: 0, flowersPerfume: 0, dusty: 0, tar: 0, roses: 0, violets: 0, },
  secondaryMinerality: { chalkyLimestone: 0, ironBlood: 0, medicinal: 0, graniteRocky: 0, salty: 0, gravelPencilShavings: 0, },
  secondaryPyrazines: { bellpepper: 0, jalapeno: 0, grass: 0 },
  secondaryOther: { cloveAndHerbs: 0, teaLeaves: 0, tobacco: 0, leather: 0, meaty: 0, peppery: 0, smoky: 0, savory: 0, gamey: 0, worcestershire: 0, cola: 0, spicy: 0, amaro: 0, licorice: 0, truffle: 0, },
};

const UNCHANGED_KEYS = [
  "id", 
  "name",
  "subname",
  "colorType",
  "redColor",
  "whiteColor",
  "sweetness",
];

const KEY_MAP = {
  'tannin,quantity': 'tanninQuantity',
  'tannin,quality': 'tanninQuality',
  'tannin,structure': 'tanninStructure',
  'tannin,location': 'tanninLocation',
  'tannin,perception': 'tanninPerception',
  'acid,quantity': 'acidQuantity',
  'acid,quality': 'acidQuality',
  'alcohol,quantity': 'alcoholQuantity',
  'alcohol,quality': 'alcoholQuality',
  'body,quantity': 'bodyQuantity',
  'body,quality': 'bodyQuality',
  'fruit,ripeness': 'fruitRipeness',
  'fruit,quantity': 'fruitRipeness',
  'fruit,quality': 'fruitQuality',
  'fruit,intensity': 'fruitIntensity',
  'fruit,concentration': 'fruitConcentration',
  'fruit,redCharacteristics': 'fruitRedCharacteristics',
  'fruit,characteristics': 'fruitRedCharacteristics',
  'fruit,whiteCharacteristics': 'fruitWhiteCharacteristics',
  'fruit,flavors': 'fruitRedFlavors',
  'fruit,redFlavors': 'fruitRedFlavors',
  'fruit,whiteFlavors': 'fruitWhiteFlavors',
  'oak,quantity': 'oakQuantity',
  'oak,quality': 'oakQuality',
  'oak,flavors': 'oakFlavors',
  'secondary,earth': 'secondaryEarth',
  'secondary,minerality': 'secondaryMinerality',
  'secondary,pyrazines': 'secondaryPyrazines',
  'secondary,other': 'secondaryOther',
};

const update = (oldWine) => {
  const newWine = {};
  Object.entries(oldWine).forEach((entry) => {
    const [key, value] = entry;
    if (UNCHANGED_KEYS.includes(key)) {
      newWine[key] = value;
    } else {
      // All other values from the old wine will be nested values
      Object.entries(value).forEach((entry2) => {
        const [key2, value2] = entry2;
        const newPath = KEY_MAP[[key, key2]];
        if (!newPath) {
          throw new Error(`Missing key ${[key, key2]}`);
        }
        newWine[newPath] = value2;
      });
    }
  });
  return newWine;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.length != 1) {
    console.log(`Invalid arguments: ${args}`);
    console.log(
      "Usage: node 2023-03-16-migrate-wine-schema.js <json_file>",
    );
    process.exit(1);
  }

  const filename = args[0];
  const rawContents = fs.readFileSync(filename);
  const wine = JSON.parse(rawContents.toString());

  const newWine = update(wine);

  const newFilename = `${filename}.new`;
  fs.writeFileSync(newFilename, JSON.stringify(newWine));
};

main();
